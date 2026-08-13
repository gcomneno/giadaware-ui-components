<script lang="ts">
	import ImageLightbox from '../../src/lib/visitor/ImageLightbox.svelte';

	let open = $state(false);
	let actionCount = $state(0);

	const labels = {
		dialog: 'Hydration image preview',
		close: 'Close preview'
	};
</script>

<div
	data-testid="image-lightbox-hydration"
	data-open={open}
	data-action-count={actionCount}
>
	<button type="button" onclick={() => open = true}>Open preview</button>

	{#snippet caption()}
		<span>Hydration caption</span>
	{/snippet}

	{#snippet actions()}
		<button type="button" onclick={() => actionCount += 1}>Hydration action</button>
	{/snippet}

	<ImageLightbox
		{open}
		onopenchange={(next) => open = next}
		src="/hydration-image.jpg"
		alt="Hydration sample"
		{labels}
		{caption}
		{actions}
	/>
</div>
