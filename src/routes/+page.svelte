<script lang="ts">
	import { RelationshipGraph } from '$lib/visitor/index.js';
	import type { RelationshipGraphLabels } from '$lib/visitor/relationship-graph.js';

	const relationshipGraphLabels = {
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
		summary: ({ nodeCount, edgeCount }) => `${nodeCount} nodes, ${edgeCount} directed relationships.`,
		relationship: ({ sourceLabel, targetLabel, relationship }) =>
			relationship
				? `${sourceLabel} to ${targetLabel}: ${relationship}`
				: `${sourceLabel} to ${targetLabel}`
	} satisfies RelationshipGraphLabels;
	const nodes = [{id:'organization',label:'Organization'},{id:'design',label:'Design'},{id:'engineering',label:'Engineering'},{id:'platform',label:'Shared platform'},{id:'community',label:'Community'}];
	const edges = [{source:'organization',target:'design',label:'supports'},{source:'organization',target:'engineering',label:'supports'},{source:'design',target:'platform',label:'contributes'},{source:'engineering',target:'platform',label:'maintains'},{source:'design',target:'engineering',type:'collaboration',label:'collaborates'},{source:'community',target:'platform',label:'uses'}];
	let message = $state('Choose a node.');
</script>

<svelte:head>
	<title>giadaware-ui-components</title>
	<meta
		name="description"
		content="Private-incubation Svelte components for GiadaWare"
	/>
</svelte:head>

<main>
	<h1>giadaware-ui-components</h1>
	<p>Visitor relationship graph showcase: shared descendants, lateral relationships, and a disconnected root.</p>
	<RelationshipGraph labels={relationshipGraphLabels} {nodes} {edges} onnodeselect={({node}) => message=`Selected ${node.label}`} onnodeactivate={({node,source}) => message=`Activated ${node.label} by ${source}`} />
	<p aria-live="polite">{message}</p>
</main>

<style>
	main {
		max-width: 64rem;
		margin: 4rem auto;
		padding: 0 1.5rem;
		font-family: system-ui, sans-serif;
		line-height: 1.6;
	}

	h1 {
		line-height: 1.1;
	}
</style>
