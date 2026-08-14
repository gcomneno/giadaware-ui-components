<script lang="ts">
	import IconButton from '../../src/lib/studio/IconButton.svelte';

	let count = $state(0);
</script>

{#snippet hydratedIcon()}
	<span>Hydrated icon</span>
{/snippet}

{#snippet unavailableIcon()}
	<span>Unavailable icon</span>
{/snippet}

<div data-testid="icon-button-hydration-probe" data-count={count}>
	<IconButton
		label="Hydrated action"
		icon={hydratedIcon}
		data-testid="hydrated-icon-button"
		onclick={() => count += 1}
	/>
	<IconButton
		label="Unavailable action"
		icon={unavailableIcon}
		variant="danger"
		size="compact"
		disabled
	/>
</div>
