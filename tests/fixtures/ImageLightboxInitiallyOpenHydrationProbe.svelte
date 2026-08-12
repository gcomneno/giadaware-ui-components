<script lang="ts">
	import ImageLightbox from '../../src/lib/visitor/ImageLightbox.svelte';

	let open = $state(true);

	const labels = {
		dialog: 'Hydration image preview',
		close: 'Close preview'
	};
</script>

<div data-testid="image-lightbox-hydration" data-open={open}>
	<button type="button" onclick={() => open = true}>Open preview</button>

	{#snippet caption()}
		<span>Hydration caption</span>
	{/snippet}

	<ImageLightbox
		{open}
		onopenchange={(next) => open = next}
		src="/hydration-image.jpg"
		alt="Hydration sample"
		{labels}
		{caption}
	/>
</div>
