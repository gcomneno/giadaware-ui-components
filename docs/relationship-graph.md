# RelationshipGraph

Import the visitor-facing component and types only from the visitor entry point:

```svelte
<script lang="ts">
	import { RelationshipGraph } from 'giadaware-ui-components/visitor';
	import type {
		RelationshipGraphEdge,
		RelationshipGraphLabels,
		RelationshipGraphNode
	} from 'giadaware-ui-components/visitor';

	const nodes: RelationshipGraphNode[] = [
		{ id: 'a', label: 'Alpha' },
		{ id: 'b', label: 'Beta', href: '/beta' }
	];

	const edges: RelationshipGraphEdge[] = [
		{ source: 'a', target: 'b', type: 'support', label: 'Supports' }
	];

	const labels = {
		region: 'Relationship graph',
		controls: 'Graph controls',
		zoomIn: 'Zoom in',
		zoomOut: 'Zoom out',
		resetView: 'Reset view',
		fitGraph: 'Fit graph',
		panUp: 'Pan up',
		panDown: 'Pan down',
		panLeft: 'Pan left',
		panRight: 'Pan right',
		empty: 'No relationships to display.',
		summary: ({ nodeCount, edgeCount }) =>
			`${nodeCount} nodes, ${edgeCount} directed relationships.`,
		relationship: ({ sourceLabel, targetLabel, relationship }) =>
			relationship
				? `${sourceLabel} to ${targetLabel}: ${relationship}`
				: `${sourceLabel} to ${targetLabel}`
	} satisfies RelationshipGraphLabels;
</script>

<RelationshipGraph {nodes} {edges} {labels} />
```

Nodes require string `id` and `label`; optional `image` and `href` are strings.
Edges require string `source` and `target`; optional `type` and `label` are
strings. Arrays may be readonly and are never mutated.

## Consumer-owned labels

`labels` is required. Giada UI owns graph interaction semantics and accessibility
wiring, while the consumer owns every graph-facing string.

`RelationshipGraphLabels` contains:

- `region`: accessible name for the graph region;
- `controls`: accessible name for the controls group;
- `zoomIn` and `zoomOut`;
- `resetView` and `fitGraph`;
- `panUp`, `panDown`, `panLeft` and `panRight`;
- `empty`: visible empty-state copy;
- `summary({ nodeCount, edgeCount })`: graph summary formatter;
- `relationship({ edge, sourceLabel, targetLabel, relationship })`: formatter
  for each accessible relationship description.

The formatter callbacks deliberately receive structured values rather than
preformatted English. Consumers can therefore apply their own localization,
pluralization and domain terminology. `relationship` is the normalized edge
label when present, otherwise its type; it is omitted when neither exists.

Giada UI does not provide built-in English fallbacks for this contract.

## Layout and invalid data

The internal dependency-free layout is hierarchical but does not assume a tree.
It accepts shared children, multiple incoming edges, lateral or cyclic edges,
disconnected components, empty graphs, and single nodes. Valid records are
copied and sorted by ID/edge fields before layout. Empty or whitespace-only IDs
and labels are discarded. The first duplicate ID in the caller array wins.
Edges with missing endpoints are discarded. Optional empty strings are omitted.
Non-array runtime node and edge values become empty arrays. These rules keep
graph data SSR-safe and hydration-deterministic; graph-data validation is
intentionally non-throwing.

Strongly connected components are identified deterministically and collapsed
into an acyclic component graph. That graph is ranked once; cycle members then
occupy stable intra-component rows, producing useful forward, lateral, and
backward relationships without rank inflation. Forward paths enter nodes
vertically, lateral and backward paths use an outer routing lane, and self-loops
use a dedicated curved path outside the node body. Arrowheads are inline SVG
paths, so multiple component instances do not share fragment IDs. Rows are
ID-sorted. This is a readable general-purpose layout, not an optimization engine
for very large graphs, edge-crossing minimization, or force simulation.

## Controls and callbacks

Mouse wheel and pinch gestures zoom; pointer dragging pans. Native buttons
provide explicit Zoom in, Zoom out, directional pan, Reset view, and Fit graph
operations. Their visible or accessible labels come from `labels`.

Activating a node selects and centers it. `onnodeselect` receives `{ node }`.
`onnodeactivate` receives `{ node, source }`, where `source` is `pointer` or
`keyboard`. The node in either payload is a normalized copy. Selection fires
immediately before activation.

When a node control has focus, Arrow Up, Arrow Down, Arrow Left, and Arrow Right
select the nearest node in the requested geometric half-plane, move focus to it,
and center it. Directional navigation is deterministic. It does not activate
the destination node; Enter, Space, or normal link activation remain responsible
for activation.

Nodes with `href` are native links and retain navigation, context-menu, and
browser link behavior. Other nodes are native buttons, including Enter and Space
activation. Consumers own destination validity, routing behavior, localized
labels and content, image availability, and application state resulting from
callbacks.

## Accessibility and resilience

The graph is a named region using `labels.region`. The controls group and every
viewport control use consumer-provided names. Node controls remain native links
or buttons with visible focus.

A visually hidden summary uses `labels.summary` for graph counts and
`labels.relationship` for each relationship. Edge geometry remains decorative
and hidden from the accessibility tree, avoiding noisy SVG primitives. Node text
remains present when an image is absent or fails. Empty graphs render
`labels.empty` explicitly.

The component has no animated transition, and reduced-motion mode disables the
transform optimization. It avoids browser globals during SSR. Its fixed-height,
clipped viewport and wrapping controls remain usable in narrow containers.

## Migration from the initial contract

The initial incubation API accepted separate `ariaLabel` and `emptyLabel` props
and supplied English defaults:

```svelte
<RelationshipGraph
	{nodes}
	{edges}
	ariaLabel="Relationship graph"
	emptyLabel="No relationships to display."
/>
```

Replace those props with the required `labels` contract:

```svelte
<RelationshipGraph {nodes} {edges} {labels} />
```

Move the region name, empty-state copy, control names, graph summary, and
relationship formatter into the consumer's localization layer. No application
routing or i18n service is imported by Giada UI.

## Styling

`class` and `style` compose on the root. Stable hooks are
`.giu-relationship-graph` and the following custom properties:
`--giu-relationship-graph-height`, `--giu-relationship-graph-narrow-height`,
`--giu-relationship-graph-border`, `--giu-relationship-graph-radius`,
`--giu-relationship-graph-background`, `--giu-relationship-graph-color`,
`--giu-relationship-graph-focus`, `--giu-relationship-graph-edge`,
`--giu-relationship-graph-node-border`, `--giu-relationship-graph-node-background`,
and `--giu-relationship-graph-node-color`.

The stable state attributes are `data-giu-relationship-graph`, `data-giu-empty`,
`data-giu-scale`, `data-giu-node-id`, and `data-giu-edge-kind` (`forward`,
`lateral`, `backward`, or `self`). Internal focus hooks, path coordinates, and
DOM nesting are not public API. The component does not import CSS automatically;
`visitor/styles.css` remains a reserved empty explicit stylesheet entry.
