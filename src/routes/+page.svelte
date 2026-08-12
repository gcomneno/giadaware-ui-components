<script lang="ts">
	import { ImageLightbox, RelationshipGraph } from '$lib/visitor/index.js';
	import type { ImageLightboxLabels, RelationshipGraphLabels } from '$lib/visitor/index.js';

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
	const imageLightboxLabels = {
		dialog: 'Sample image preview',
		close: 'Close preview'
	} satisfies ImageLightboxLabels;
	const showcaseImageSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22800%22 viewBox=%220 0 1200 800%22%3E%3Crect width=%221200%22 height=%22800%22 fill=%22%23575f6b%22/%3E%3Cpath d=%22M0 620L300 360L520 540L760 260L1200 650V800H0Z%22 fill=%22%23d8dde5%22/%3E%3C/svg%3E';
	let lightboxOpen = $state(false);
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

	<section>
		<h2>Image lightbox</h2>
		<button type="button" onclick={() => lightboxOpen = true}>Open sample image</button>

		{#snippet lightboxCaption()}
			<span>Consumer-owned caption rendered without cropping the image.</span>
		{/snippet}

		<ImageLightbox
			open={lightboxOpen}
			onopenchange={(next) => lightboxOpen = next}
			src={showcaseImageSrc}
			alt="Abstract mountain landscape"
			labels={imageLightboxLabels}
			caption={lightboxCaption}
		/>
	</section>
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
