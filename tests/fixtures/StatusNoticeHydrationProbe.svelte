<script lang="ts">
	import StatusNotice from '../../src/lib/StatusNotice.svelte';

	let dismissCount = $state(0);
</script>

{#snippet icon()}
	<span data-testid="hydration-status-notice-icon">!</span>
{/snippet}

{#snippet actions()}
	<button type="button">Review</button>
{/snippet}

<div
	data-testid="status-notice-hydration-probe"
	data-dismiss-count={dismissCount}
>
	<StatusNotice
		id="hydration-status-notice"
		title="Hydration notice"
		tone="success"
		announcement="assertive"
		class="hydration-status-notice"
		style="--giu-status-notice-padding: 1.25rem"
		{icon}
		{actions}
		onDismiss={() => dismissCount += 1}
		closeLabel="Dismiss hydration notice"
	>
		<p>Hydration body</p>
	</StatusNotice>
</div>
