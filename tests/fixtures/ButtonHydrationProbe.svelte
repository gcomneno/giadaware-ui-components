<script lang="ts">
	import Button from '../../src/lib/studio/Button.svelte';
	let count = $state(0);
</script>

<div data-testid="button-hydration-probe" data-count={count}>
	<Button data-testid="hydrated-button" onclick={() => count += 1}>Hydrated action</Button>
	<Button variant="danger" size="compact" disabled>Unavailable action</Button>
</div>
