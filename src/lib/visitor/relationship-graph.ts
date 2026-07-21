import type { HTMLAttributes } from 'svelte/elements';

export type RelationshipGraphNode = { id: string; label: string; image?: string; href?: string };
export type RelationshipGraphEdge = { source: string; target: string; type?: string; label?: string };
export type RelationshipGraphSelection = { node: RelationshipGraphNode };
export type RelationshipGraphActivation = { node: RelationshipGraphNode; source: 'pointer' | 'keyboard' };
export type RelationshipGraphProps = {
	nodes?: readonly RelationshipGraphNode[];
	edges?: readonly RelationshipGraphEdge[];
	onnodeselect?: (detail: RelationshipGraphSelection) => void;
	onnodeactivate?: (detail: RelationshipGraphActivation) => void;
	emptyLabel?: string;
	ariaLabel?: string;
	class?: HTMLAttributes<HTMLDivElement>['class'];
	style?: HTMLAttributes<HTMLDivElement>['style'];
};

export type NormalizedRelationshipGraph = { nodes: readonly RelationshipGraphNode[]; edges: readonly RelationshipGraphEdge[] };
export type RelationshipGraphPoint = RelationshipGraphNode & { x: number; y: number; rank: number };
export type RelationshipGraphEdgeGeometry = RelationshipGraphEdge & {
	kind: 'forward' | 'lateral' | 'backward' | 'self';
	path: string;
	arrowPath: string;
};
export type RelationshipGraphLayout = {
	nodes: readonly RelationshipGraphPoint[];
	edges: readonly RelationshipGraphEdge[];
	edgeGeometry: readonly RelationshipGraphEdgeGeometry[];
	pointsById: ReadonlyMap<string, RelationshipGraphPoint>;
	width: number;
	height: number;
};
export type RelationshipGraphViewport = { x: number; y: number; scale: number };

const NODE_HALF_WIDTH = 80;
const NODE_HALF_HEIGHT = 42;
const compareLexically = (a: string, b: string): number => a === b ? 0 : a < b ? -1 : 1;
const text = (value: unknown): string | undefined =>
	typeof value === 'string' && value.trim() ? value.trim() : undefined;

/** Invalid nodes are discarded, the first duplicate ID wins, and edges whose
 * endpoints are absent are discarded. Records are copied and sorted. */
export function normalizeRelationshipGraph(nodes: unknown, edges: unknown): NormalizedRelationshipGraph {
	const byId = new Map<string, RelationshipGraphNode>();
	if (Array.isArray(nodes)) for (const candidate of nodes) {
		if (!candidate || typeof candidate !== 'object') continue;
		const value = candidate as Record<string, unknown>;
		const id = text(value.id);
		const label = text(value.label);
		if (!id || !label || byId.has(id)) continue;
		const image = text(value.image);
		const href = text(value.href);
		byId.set(id, { id, label, ...(image ? { image } : {}), ...(href ? { href } : {}) });
	}
	const normalizedNodes = [...byId.values()].sort((a, b) => compareLexically(a.id, b.id));
	const normalizedEdges: RelationshipGraphEdge[] = [];
	if (Array.isArray(edges)) for (const candidate of edges) {
		if (!candidate || typeof candidate !== 'object') continue;
		const value = candidate as Record<string, unknown>;
		const source = text(value.source);
		const target = text(value.target);
		if (!source || !target || !byId.has(source) || !byId.has(target)) continue;
		const type = text(value.type);
		const label = text(value.label);
		normalizedEdges.push({ source, target, ...(type ? { type } : {}), ...(label ? { label } : {}) });
	}
	normalizedEdges.sort((a, b) => compareLexically(
		`${a.source}\0${a.target}\0${a.type ?? ''}\0${a.label ?? ''}`,
		`${b.source}\0${b.target}\0${b.type ?? ''}\0${b.label ?? ''}`
	));
	return { nodes: normalizedNodes, edges: normalizedEdges };
}

function componentRanks(graph: NormalizedRelationshipGraph): Map<string, number> {
	const outgoing = new Map(graph.nodes.map((node) => [node.id, [] as string[]]));
	for (const edge of graph.edges) outgoing.get(edge.source)?.push(edge.target);
	for (const targets of outgoing.values()) targets.sort(compareLexically);

	let nextIndex = 0;
	const indices = new Map<string, number>();
	const lowLinks = new Map<string, number>();
	const stack: string[] = [];
	const onStack = new Set<string>();
	const components: string[][] = [];

	function visit(id: string): void {
		indices.set(id, nextIndex);
		lowLinks.set(id, nextIndex++);
		stack.push(id);
		onStack.add(id);
		for (const target of outgoing.get(id) ?? []) {
			if (!indices.has(target)) {
				visit(target);
				lowLinks.set(id, Math.min(lowLinks.get(id)!, lowLinks.get(target)!));
			} else if (onStack.has(target)) {
				lowLinks.set(id, Math.min(lowLinks.get(id)!, indices.get(target)!));
			}
		}
		if (lowLinks.get(id) !== indices.get(id)) return;
		const component: string[] = [];
		let member: string;
		do {
			member = stack.pop()!;
			onStack.delete(member);
			component.push(member);
		} while (member !== id);
		components.push(component.sort(compareLexically));
	}

	for (const node of graph.nodes) if (!indices.has(node.id)) visit(node.id);
	components.sort((a, b) => compareLexically(a[0], b[0]));
	const componentByNode = new Map<string, number>();
	components.forEach((component, index) => component.forEach((id) => componentByNode.set(id, index)));
	const componentEdges = new Map(components.map((_, index) => [index, new Set<number>()]));
	const incoming = new Map(components.map((_, index) => [index, 0]));
	for (const edge of graph.edges) {
		const source = componentByNode.get(edge.source)!;
		const target = componentByNode.get(edge.target)!;
		if (source === target || componentEdges.get(source)!.has(target)) continue;
		componentEdges.get(source)!.add(target);
		incoming.set(target, incoming.get(target)! + 1);
	}
	const ranks = new Map(components.map((_, index) => [index, 0]));
	const queue = [...incoming].filter(([, count]) => count === 0).map(([index]) => index).sort((a, b) => compareLexically(components[a][0], components[b][0]));
	while (queue.length) {
		const source = queue.shift()!;
		for (const target of [...componentEdges.get(source)!].sort((a, b) => compareLexically(components[a][0], components[b][0]))) {
			const sourceSpan = Math.max(1, Math.ceil(components[source].length / 2));
			ranks.set(target, Math.max(ranks.get(target)!, ranks.get(source)! + sourceSpan));
			incoming.set(target, incoming.get(target)! - 1);
			if (incoming.get(target) === 0) queue.push(target);
		}
		queue.sort((a, b) => compareLexically(components[a][0], components[b][0]));
	}
	return new Map(graph.nodes.map((node) => {
		const componentIndex = componentByNode.get(node.id)!;
		const memberIndex = components[componentIndex].indexOf(node.id);
		return [node.id, ranks.get(componentIndex)! + Math.floor(memberIndex / 2)];
	}));
}

function edgePath(edge: RelationshipGraphEdge, source: RelationshipGraphPoint, target: RelationshipGraphPoint, width: number): RelationshipGraphEdgeGeometry {
	if (source.id === target.id) {
		const right = source.x + NODE_HALF_WIDTH;
		return { ...edge, kind: 'self', path: `M ${right} ${source.y - 16} C ${right + 55} ${source.y - 70}, ${right + 55} ${source.y + 70}, ${right} ${source.y + 16}`, arrowPath: `M ${right} ${source.y + 16} L ${right + 12} ${source.y + 9} L ${right + 11} ${source.y + 23} Z` };
	}
	if (target.rank > source.rank) {
		if (target.rank > source.rank + 1) {
			const lane = 30;
			return { ...edge, kind: 'forward', path: `M ${source.x} ${source.y + NODE_HALF_HEIGHT} L ${source.x} ${source.y + 65} L ${lane} ${source.y + 65} L ${lane} ${target.y - 65} L ${target.x} ${target.y - 65} L ${target.x} ${target.y - NODE_HALF_HEIGHT}`, arrowPath: `M ${target.x} ${target.y - NODE_HALF_HEIGHT} L ${target.x - 6} ${target.y - NODE_HALF_HEIGHT - 11} L ${target.x + 6} ${target.y - NODE_HALF_HEIGHT - 11} Z` };
		}
		const middle = (source.y + target.y) / 2;
		return { ...edge, kind: 'forward', path: `M ${source.x} ${source.y + NODE_HALF_HEIGHT} C ${source.x} ${middle}, ${target.x} ${middle}, ${target.x} ${target.y - NODE_HALF_HEIGHT}`, arrowPath: `M ${target.x} ${target.y - NODE_HALF_HEIGHT} L ${target.x - 6} ${target.y - NODE_HALF_HEIGHT - 11} L ${target.x + 6} ${target.y - NODE_HALF_HEIGHT - 11} Z` };
	}
	const kind = target.rank === source.rank ? 'lateral' : 'backward';
	if (kind === 'lateral') {
		const routeY = source.y - 70;
		return { ...edge, kind, path: `M ${source.x} ${source.y - NODE_HALF_HEIGHT} C ${source.x} ${routeY}, ${target.x} ${routeY}, ${target.x} ${target.y - NODE_HALF_HEIGHT}`, arrowPath: `M ${target.x} ${target.y - NODE_HALF_HEIGHT} L ${target.x - 6} ${target.y - NODE_HALF_HEIGHT - 11} L ${target.x + 6} ${target.y - NODE_HALF_HEIGHT - 11} Z` };
	}
	const lane = width - 30;
	return { ...edge, kind, path: `M ${source.x} ${source.y + NODE_HALF_HEIGHT} L ${source.x} ${source.y + 70} L ${lane} ${source.y + 70} L ${lane} ${target.y + 70} L ${target.x} ${target.y + 70} L ${target.x} ${target.y + NODE_HALF_HEIGHT}`, arrowPath: `M ${target.x} ${target.y + NODE_HALF_HEIGHT} L ${target.x - 6} ${target.y + NODE_HALF_HEIGHT + 11} L ${target.x + 6} ${target.y + NODE_HALF_HEIGHT + 11} Z` };
}

export function layoutRelationshipGraph(graph: NormalizedRelationshipGraph): RelationshipGraphLayout {
	if (!graph.nodes.length) return { nodes: [], edges: graph.edges, edgeGeometry: [], pointsById: new Map(), width: 0, height: 0 };
	const ranks = componentRanks(graph);
	const rows = new Map<number, RelationshipGraphNode[]>();
	for (const node of graph.nodes) {
		const rank = ranks.get(node.id)!;
		rows.set(rank, [...(rows.get(rank) ?? []), node]);
	}
	const maxColumns = Math.max(...[...rows.values()].map((row) => row.length));
	const width = Math.max(440, maxColumns * 220 + 200);
	const height = Math.max(220, rows.size * 180 + 80);
	const nodes: RelationshipGraphPoint[] = [];
	for (const [rank, row] of [...rows].sort(([a], [b]) => a - b)) {
		row.forEach((node, index) => nodes.push({ ...node, rank, x: (width - 120) / 2 + (index - (row.length - 1) / 2) * 220, y: 90 + rank * 180 }));
	}
	const pointsById = new Map(nodes.map((node) => [node.id, node]));
	const edgeGeometry = graph.edges.map((edge) => edgePath(edge, pointsById.get(edge.source)!, pointsById.get(edge.target)!, width));
	return { nodes, edges: graph.edges, edgeGeometry, pointsById, width, height };
}

export function relationshipDescription(edge: RelationshipGraphEdge, nodesById: ReadonlyMap<string, RelationshipGraphNode>): string {
	const source = nodesById.get(edge.source)?.label ?? edge.source;
	const target = nodesById.get(edge.target)?.label ?? edge.target;
	const relationship = edge.label ?? edge.type;
	return relationship ? `${source} to ${target}: ${relationship}` : `${source} to ${target}`;
}

export function clampRelationshipGraphViewport(viewport: RelationshipGraphViewport): RelationshipGraphViewport {
	return { x: Number.isFinite(viewport.x) ? viewport.x : 0, y: Number.isFinite(viewport.y) ? viewport.y : 0, scale: Math.min(3, Math.max(0.25, Number.isFinite(viewport.scale) ? viewport.scale : 1)) };
}

export function fitRelationshipGraphViewport(graphWidth: number, graphHeight: number, containerWidth: number, containerHeight: number): RelationshipGraphViewport {
	if (!(graphWidth > 0 && graphHeight > 0 && containerWidth > 0 && containerHeight > 0)) return { x: 0, y: 0, scale: 1 };
	const scale = Math.min(2, Math.max(0.25, Math.min((containerWidth - 32) / graphWidth, (containerHeight - 32) / graphHeight)));
	return { scale, x: (containerWidth - graphWidth * scale) / 2, y: (containerHeight - graphHeight * scale) / 2 };
}
