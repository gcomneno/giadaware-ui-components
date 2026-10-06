<script lang="ts">
	import Dialog from '../../src/lib/studio/Dialog.svelte';

	let open = $state(true);
	let actionCount = $state(0);
</script>

<div
	data-testid="dialog-hydration-probe"
	data-open={open}
	data-action-count={actionCount}
>
	<button
		type="button"
		data-testid="dialog-hydration-trigger"
		onclick={() => open = true}
	>
		Open hydrated dialog
	</button>

	<Dialog
		{open}
		onopenchange={(next) => open = next}
		aria-label="Hydrated dialog"
		data-testid="dialog-hydration-dialog"
	>
		<button
			type="button"
			data-testid="dialog-hydration-focus"
			onclick={() => actionCount += 1}
		>
			Hydration focus
		</button>
	</Dialog>
</div>
