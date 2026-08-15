<script lang="ts">
	import StatusNotice from '../../src/lib/StatusNotice.svelte';

	let dismissCount = $state(0);
</script>

{#snippet icon()}
	<span data-testid="status-notice-icon">i</span>
{/snippet}

{#snippet body()}
	<p>Use the published URL after the cache refresh completes.</p>
{/snippet}

{#snippet actions()}
	<a href="/preview">Preview</a>
	<button type="button">Retry</button>
{/snippet}

<div data-testid="status-notice-probe" data-dismiss-count={dismissCount}>
	<StatusNotice
		id="publish-status"
		title="Publish queued"
		tone="warning"
		announcement="polite"
		class="consumer-notice"
		style="--giu-status-notice-gap: 1rem"
		{icon}
		{actions}
		onDismiss={() => dismissCount += 1}
		closeLabel="Dismiss notice"
	>
		{@render body()}
	</StatusNotice>
</div>
