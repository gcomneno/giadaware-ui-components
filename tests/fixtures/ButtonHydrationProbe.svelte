<script lang="ts">
	import Button from '../../src/lib/studio/Button.svelte';
	let count = $state(0);
</script>

{#snippet hydratedLeading()}
	<span>Hydrated leading</span>
{/snippet}

{#snippet hydratedTrailing()}
	<span>Hydrated trailing</span>
{/snippet}

<div data-testid="button-hydration-probe" data-count={count}>
	<Button
		leading={hydratedLeading}
		trailing={hydratedTrailing}
		data-testid="hydrated-button"
		onclick={() => count += 1}
	>Hydrated action</Button>
	<Button variant="danger" size="compact" disabled>Unavailable action</Button>
</div>
