<script lang="ts">
	import {
		clampRelationshipGraphViewport,
		findRelationshipGraphDirectionalNode,
		fitRelationshipGraphViewport,
		layoutRelationshipGraph,
		normalizeRelationshipGraph,
		relationshipDescription
	} from './relationship-graph.js';
	import type {
		RelationshipGraphDirection,
		RelationshipGraphEdge,
		RelationshipGraphPoint,
		RelationshipGraphProps,
		RelationshipGraphViewport
	} from './relationship-graph.js';

	let {
		nodes = [],
		edges = [],
		labels,
		onnodeselect,
		onnodeactivate,
		class: className,
		style
	}: RelationshipGraphProps = $props();

	const graph = $derived(normalizeRelationshipGraph(nodes, edges));
	const layout = $derived(layoutRelationshipGraph(graph));
	const nodesById = $derived(new Map(graph.nodes.map((node) => [node.id, node])));

	let viewport: RelationshipGraphViewport = $state({ x: 0, y: 0, scale: 1 });
	let root = $state<HTMLDivElement>();
	let dragging = false;
	let moved = false;
	let lastX = 0;
	let lastY = 0;
	const pointers = new Map<number, { x: number; y: number }>();
	let pinchDistance = 0;

	function normalizedNode(node: RelationshipGraphPoint) {
		return {
			id: node.id,
			label: node.label,
			...(node.image ? { image: node.image } : {}),
			...(node.href ? { href: node.href } : {})
		};
	}

	function update(next: RelationshipGraphViewport) {
		viewport = clampRelationshipGraphViewport(next);
	}

	function zoom(factor: number) {
		const box = root?.getBoundingClientRect();
		const cx = (box?.width ?? 0) / 2;
		const cy = (box?.height ?? 0) / 2;
		const scale = viewport.scale * factor;
		update({
			scale,
			x: cx - ((cx - viewport.x) * scale) / viewport.scale,
			y: cy - ((cy - viewport.y) * scale) / viewport.scale
		});
	}

	function pan(dx: number, dy: number) {
		update({ ...viewport, x: viewport.x + dx, y: viewport.y + dy });
	}

	function reset() {
		viewport = { x: 0, y: 0, scale: 1 };
	}

	function fit() {
		const box = root?.getBoundingClientRect();
		viewport = fitRelationshipGraphViewport(
			layout.width,
			layout.height,
			box?.width ?? 0,
			box?.height ?? 0
		);
	}

	function centerNode(node: RelationshipGraphPoint) {
		const box = root?.getBoundingClientRect();
		update({
			...viewport,
			x: (box?.width ?? 0) / 2 - node.x * viewport.scale,
			y: (box?.height ?? 0) / 2 - node.y * viewport.scale
		});
	}

	function focusNode(node: RelationshipGraphPoint) {
		centerNode(node);
		onnodeselect?.({ node: normalizedNode(node) });
	}

	function activate(node: RelationshipGraphPoint, source: 'pointer' | 'keyboard') {
		focusNode(node);
		onnodeactivate?.({ node: normalizedNode(node), source });
	}

	function nodeControl(id: string): HTMLElement | undefined {
		for (const element of root?.querySelectorAll<HTMLElement>('[data-giu-node-control]') ?? []) {
			if (element.dataset.giuNodeControl === id) return element;
		}
		return undefined;
	}

	function navigateNode(event: KeyboardEvent, node: RelationshipGraphPoint) {
		const directionByKey: Partial<Record<string, RelationshipGraphDirection>> = {
			ArrowUp: 'up',
			ArrowDown: 'down',
			ArrowLeft: 'left',
			ArrowRight: 'right'
		};
		const direction = directionByKey[event.key];
		if (!direction) return;

		const target = findRelationshipGraphDirectionalNode(layout.nodes, node.id, direction);
		if (!target) return;

		event.preventDefault();
		nodeControl(target.id)?.focus();
		focusNode(target);
	}

	function wheel(event: WheelEvent) {
		event.preventDefault();
		zoom(event.deltaY < 0 ? 1.12 : 1 / 1.12);
	}

	function down(event: PointerEvent) {
		if ((event.target as Element).closest('button,a')) {
			moved = false;
			return;
		}
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		try {
			root?.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic events need not own pointer capture.
		}
		dragging = pointers.size === 1;
		moved = false;
		lastX = event.clientX;
		lastY = event.clientY;
		if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
		}
	}

	function move(event: PointerEvent) {
		if (!pointers.has(event.pointerId)) return;
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			const distance = Math.hypot(a.x - b.x, a.y - b.y);
			if (pinchDistance) zoom(distance / pinchDistance);
			pinchDistance = distance;
			return;
		}
		if (dragging) {
			const dx = event.clientX - lastX;
			const dy = event.clientY - lastY;
			if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
			update({ ...viewport, x: viewport.x + dx, y: viewport.y + dy });
			lastX = event.clientX;
			lastY = event.clientY;
		}
	}

	function up(event: PointerEvent) {
		pointers.delete(event.pointerId);
		pinchDistance = 0;
		if (pointers.size === 1) {
			const remaining = [...pointers.values()][0];
			dragging = true;
			moved = false;
			lastX = remaining.x;
			lastY = remaining.y;
		} else {
			dragging = false;
		}
	}

	function relationshipText(edge: RelationshipGraphEdge): string {
		return relationshipDescription(edge, nodesById, labels.relationship);
	}
</script>

<div
		bind:this={root}
		class={['giu-relationship-graph', className]}
		{style}
		role="region"
		aria-label={labels.region}
		data-giu-relationship-graph
		data-giu-empty={layout.nodes.length === 0}
		onwheel={wheel}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
	>
		<div class="giu-relationship-graph__controls" aria-label={labels.controls}>
			<button type="button" aria-label={labels.zoomIn} onclick={() => zoom(1.2)}>+</button>
			<button type="button" aria-label={labels.zoomOut} onclick={() => zoom(1 / 1.2)}>−</button>
			<button type="button" aria-label={labels.panLeft} onclick={() => pan(48, 0)}>←</button>
			<button type="button" aria-label={labels.panUp} onclick={() => pan(0, 48)}>↑</button>
			<button type="button" aria-label={labels.panDown} onclick={() => pan(0, -48)}>↓</button>
			<button type="button" aria-label={labels.panRight} onclick={() => pan(-48, 0)}>→</button>
			<button type="button" onclick={reset}>{labels.resetView}</button>
			<button type="button" onclick={fit}>{labels.fitGraph}</button>
		</div>

		{#if layout.nodes.length === 0}
			<p class="giu-relationship-graph__empty">{labels.empty}</p>
		{:else}
			<div
				class="giu-relationship-graph__viewport"
				style={`transform: translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`}
				data-giu-scale={viewport.scale.toFixed(3)}
			>
				<svg class="giu-relationship-graph__edges" width={layout.width} height={layout.height} aria-hidden="true">
					{#each layout.edgeGeometry as edge, i (`${edge.source}-${edge.target}-${i}`)}
						{@const a = layout.pointsById.get(edge.source)}
						{@const b = layout.pointsById.get(edge.target)}
						<path class="giu-relationship-graph__edge" d={edge.path} data-giu-edge-kind={edge.kind}></path>
						<path class="giu-relationship-graph__arrow" d={edge.arrowPath}></path>
						{#if edge.label && a && b}
							<text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6}>{edge.label}</text>
						{/if}
					{/each}
				</svg>

				{#each layout.nodes as node (node.id)}
					<div
						class="giu-relationship-graph__node"
						style={`left:${node.x}px;top:${node.y}px`}
						data-giu-node-id={node.id}
					>
						{#if node.href}
							<a
								href={node.href}
								data-giu-node-control={node.id}
								onkeydown={(event) => navigateNode(event, node)}
								onclick={(event) => {
									if (moved) event.preventDefault();
									else activate(node, event.detail === 0 ? 'keyboard' : 'pointer');
								}}
							>
								{#if node.image}<img src={node.image} alt="" />{/if}
								<span>{node.label}</span>
							</a>
						{:else}
							<button
								type="button"
								data-giu-node-control={node.id}
								onkeydown={(event) => navigateNode(event, node)}
								onclick={(event) => {
									if (!moved) activate(node, event.detail === 0 ? 'keyboard' : 'pointer');
								}}
							>
								{#if node.image}<img src={node.image} alt="" />{/if}
								<span>{node.label}</span>
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<div class="giu-relationship-graph__summary">
			<span>{labels.summary({ nodeCount: layout.nodes.length, edgeCount: layout.edges.length })}</span>
			{#if layout.edges.length}
				<ul>
					{#each layout.edges as edge, i (`summary-${edge.source}-${edge.target}-${i}`)}
						<li>{relationshipText(edge)}</li>
					{/each}
				</ul>
			{/if}
		</div>
</div>

<style>
	.giu-relationship-graph{position:relative;box-sizing:border-box;width:100%;min-width:0;height:var(--giu-relationship-graph-height,32rem);overflow:hidden;border:1px solid var(--giu-relationship-graph-border,#bbb);border-radius:var(--giu-relationship-graph-radius,.75rem);background:var(--giu-relationship-graph-background,#fafafa);color:var(--giu-relationship-graph-color,#202020);touch-action:none;user-select:none}
	.giu-relationship-graph__controls{position:absolute;z-index:3;display:flex;flex-wrap:wrap;gap:.25rem;max-width:calc(100% - 1rem);padding:.5rem}.giu-relationship-graph__controls button{min-width:2.75rem;min-height:2.75rem;border:1px solid #666;border-radius:.35rem;background:#fff;color:#111;font:inherit}.giu-relationship-graph button:focus-visible,.giu-relationship-graph a:focus-visible{outline:3px solid var(--giu-relationship-graph-focus,#1559a6);outline-offset:2px}
	.giu-relationship-graph__viewport{position:absolute;transform-origin:0 0;will-change:transform}.giu-relationship-graph__edges{position:absolute;overflow:visible}.giu-relationship-graph__edge{fill:none;stroke:var(--giu-relationship-graph-edge,#6b7280);stroke-width:2}.giu-relationship-graph__arrow{fill:var(--giu-relationship-graph-edge,#6b7280)}.giu-relationship-graph__edges text{fill:currentColor;font:12px sans-serif;text-anchor:middle;paint-order:stroke;stroke:#fafafa;stroke-width:4px}
	.giu-relationship-graph__node{position:absolute;width:10rem;transform:translate(-50%,-50%)}.giu-relationship-graph__node a,.giu-relationship-graph__node button{display:flex;box-sizing:border-box;align-items:center;justify-content:center;gap:.5rem;width:100%;min-height:5.25rem;padding:.75rem;border:2px solid var(--giu-relationship-graph-node-border,#555);border-radius:.65rem;background:var(--giu-relationship-graph-node-background,#fff);color:var(--giu-relationship-graph-node-color,#111);font:inherit;font-weight:600;text-align:center;text-decoration:none;overflow-wrap:anywhere;cursor:pointer}.giu-relationship-graph__node img{width:2.25rem;height:2.25rem;object-fit:cover;border-radius:50%}.giu-relationship-graph__empty{display:grid;height:100%;margin:0;padding:4rem 1rem;box-sizing:border-box;place-items:center;text-align:center}.giu-relationship-graph__summary{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
	@media (prefers-reduced-motion:reduce){.giu-relationship-graph__viewport{will-change:auto}}
	@media (max-width:30rem){.giu-relationship-graph{height:var(--giu-relationship-graph-narrow-height,26rem)}.giu-relationship-graph__controls{background:color-mix(in srgb,#fff 92%,transparent)}}
</style>
