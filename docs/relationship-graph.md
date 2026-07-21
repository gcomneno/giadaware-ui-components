# RelationshipGraph

Import the visitor-facing component and types only from the visitor entry point:

```svelte
<script lang="ts">
	import { RelationshipGraph } from 'giadaware-ui-components/visitor';
	import type { RelationshipGraphNode, RelationshipGraphEdge } from 'giadaware-ui-components/visitor';
	const nodes: RelationshipGraphNode[] = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta', href: '/beta' }];
	const edges: RelationshipGraphEdge[] = [{ source: 'a', target: 'b', type: 'support', label: 'Supports' }];
</script>
<RelationshipGraph {nodes} {edges} />
```

Nodes require string `id` and `label`; optional `image` and `href` are strings. Edges require string `source` and `target`; optional `type` and `label` are strings. Arrays may be readonly and are never mutated.

## Layout and invalid data

The internal dependency-free layout is hierarchical but does not assume a tree. It accepts shared children, multiple incoming edges, lateral or cyclic edges, disconnected components, empty graphs, and single nodes. Valid records are copied and sorted by ID/edge fields before layout. Empty or whitespace-only IDs and labels are discarded. The first duplicate ID in the caller array wins. Edges with missing endpoints are discarded. Optional empty strings are omitted. Non-array runtime values become empty arrays. These rules make invalid runtime data SSR-safe and hydration-deterministic; validation is intentionally non-throwing.

Strongly connected components are identified deterministically and collapsed into an acyclic component graph. That graph is ranked once; cycle members then occupy stable intra-component rows, producing useful forward, lateral, and backward relationships without rank inflation. Forward paths enter nodes vertically, lateral and backward paths use an outer routing lane, and self-loops use a dedicated curved path outside the node body. Arrowheads are inline SVG paths, so multiple component instances do not share fragment IDs. Rows are ID-sorted. This is a readable general-purpose layout, not an optimization engine for very large graphs, edge-crossing minimization, or force simulation.

## Controls and callbacks

Mouse wheel and pinch gestures zoom; pointer dragging pans. Zoom in, Zoom out, Reset view, and Fit graph buttons provide explicit alternatives. Activating a node selects and centers it. `onnodeselect` receives `{ node }`. `onnodeactivate` receives `{ node, source }`, where `source` is `pointer` or `keyboard`. The node in either payload is a normalized copy. Selection fires immediately before activation.

Nodes with `href` are native links and retain navigation, context-menu, and browser link behavior. Other nodes are native buttons, including Enter and Space activation. Consumers own destination validity, routing behavior, labels/content language, image availability, and application state resulting from callbacks.

## Accessibility and resilience

The graph is a named region (`ariaLabel`, default “Relationship graph”). Controls and nodes have meaningful native accessible names and visible focus. A visually hidden summary reports counts and describes every relationship using source label, target label, and its optional label or type. Edge geometry remains decorative and hidden from the accessibility tree, avoiding noisy SVG primitives. Node text remains present when an image is absent or fails. Empty graphs render `emptyLabel` explicitly.

There is no animated transition, and reduced-motion mode disables the transform optimization. The component avoids browser globals during SSR. Its fixed-height, clipped viewport and wrapping controls remain usable in narrow containers.

## Styling

`class` and `style` compose on the root. Stable hooks are `.giu-relationship-graph` and the following custom properties: `--giu-relationship-graph-height`, `--giu-relationship-graph-narrow-height`, `--giu-relationship-graph-border`, `--giu-relationship-graph-radius`, `--giu-relationship-graph-background`, `--giu-relationship-graph-color`, `--giu-relationship-graph-focus`, `--giu-relationship-graph-edge`, `--giu-relationship-graph-node-border`, `--giu-relationship-graph-node-background`, and `--giu-relationship-graph-node-color`.

The stable state attributes are `data-giu-relationship-graph`, `data-giu-empty`, `data-giu-scale`, `data-giu-node-id`, and `data-giu-edge-kind` (`forward`, `lateral`, `backward`, or `self`). Internal path coordinates and DOM nesting are not public API. The component does not import CSS automatically; `visitor/styles.css` remains a reserved empty explicit stylesheet entry.
