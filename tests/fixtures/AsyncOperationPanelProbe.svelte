<script lang="ts">
	import AsyncOperationPanel from '../../src/lib/studio/AsyncOperationPanel.svelte';
	let count = $state(0);
</script>

<div data-testid="async-operation-panel-probe" data-action-count={count}>
	<AsyncOperationPanel state="idle" title="idle operation">
		{#snippet action()}<button type="button" onclick={() => count += 1}>Run idle</button>{/snippet}
	</AsyncOperationPanel>
	<AsyncOperationPanel state="running" title="running operation" busyLabel="Operation in progress">
		{#snippet action()}<button type="button" disabled>Run running</button>{/snippet}
	</AsyncOperationPanel>
	{#each ['success', 'warning', 'error'] as state}
		<AsyncOperationPanel state={state as 'success' | 'warning' | 'error'} title={`${state} operation`} message={`${state} message`}>
			{#snippet action()}<button type="button">Run {state}</button>{/snippet}
		</AsyncOperationPanel>
	{/each}
	<AsyncOperationPanel state="success" title="Detailed operation" message="Detailed success" technicalDetailsLabel="Technical output" technicalDetails="&lt;script&gt;raw output&lt;/script&gt;" headingLevel={3}>
		{#snippet action()}<form onsubmit={(event) => { event.preventDefault(); count += 1; }}><button>Run detailed</button></form>{/snippet}
		{#snippet description()}<p>Consumer description</p>{/snippet}
		{#snippet result()}<a href="/result">View result</a>{/snippet}
	</AsyncOperationPanel>
</div>
