<script lang="ts">
	import RelationshipGraph from '../../src/lib/visitor/RelationshipGraph.svelte';
	import type { RelationshipGraphLabels } from '../../src/lib/visitor/relationship-graph.js';

	const nodes = [
		{ id: 'a', label: 'Alpha' },
		{ id: 'b', label: 'Beta' },
		{ id: 'c', label: 'Gamma' }
	];

	const edges = [
		{ source: 'a', target: 'b', label: 'supports' },
		{ source: 'a', target: 'c' },
		{ source: 'b', target: 'c', type: 'lateral' }
	];

	const labels = {
		region: 'Grafo delle relazioni',
		controls: 'Controlli del grafo',
		zoomIn: 'Ingrandisci',
		zoomOut: 'Riduci',
		resetView: 'Reimposta vista',
		fitGraph: 'Adatta grafo',
		panUp: 'Sposta vista in alto',
		panDown: 'Sposta vista in basso',
		panLeft: 'Sposta vista a sinistra',
		panRight: 'Sposta vista a destra',
		empty: 'Nessuna relazione disponibile.',
		summary: ({ nodeCount, edgeCount }) =>
			`${nodeCount} nodi, ${edgeCount} relazioni dirette.`,
		relationship: ({ sourceLabel, targetLabel, relationship }) =>
			relationship
				? `${sourceLabel} verso ${targetLabel}: ${relationship}`
				: `${sourceLabel} verso ${targetLabel}`
	} satisfies RelationshipGraphLabels;
</script>

<div data-testid="localized-relationship-probe">
	<RelationshipGraph {labels} {nodes} {edges} />
</div>
