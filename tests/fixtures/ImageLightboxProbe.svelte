<script lang="ts">
	import ImageLightbox from '../../src/lib/visitor/ImageLightbox.svelte';

	let open = $state(false);
	let requests = $state(0);
	let actionClicks = $state(0);
	let rejectNextClose = $state(false);

	const labels = {
		dialog: 'Image preview',
		close: 'Close image'
	};

	const src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22800%22 viewBox=%220 0 1200 800%22%3E%3Crect width=%221200%22 height=%22800%22 fill=%22%23666%22/%3E%3C/svg%3E';

	function handleOpenChange(next: boolean) {
		requests += 1;

		if (!next && rejectNextClose) {
			rejectNextClose = false;
			return;
		}

		open = next;
	}
</script>

<div
	data-testid="image-lightbox-probe"
	data-open={open}
	data-requests={requests}
	data-action-clicks={actionClicks}
>
	<button
		type="button"
		data-testid="image-lightbox-trigger"
		onclick={() => open = true}
	>
		Open sample image
	</button>

	<button
		type="button"
		onclick={() => rejectNextClose = true}
	>
		Reject next close request
	</button>

	{#snippet caption()}
		<span>Consumer-owned caption</span>
	{/snippet}

	{#snippet actions()}
		<button type="button" onclick={() => actionClicks += 1}>
			Next image
		</button>
	{/snippet}

	<ImageLightbox
		{open}
		onopenchange={handleOpenChange}
		{src}
		alt="Sample landscape"
		{labels}
		{caption}
		{actions}
	/>
</div>
