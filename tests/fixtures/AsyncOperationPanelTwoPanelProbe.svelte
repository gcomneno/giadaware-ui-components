<script lang="ts">
	import AsyncOperationPanel from '../../src/lib/studio/AsyncOperationPanel.svelte';

	type State = 'idle' | 'running' | 'success';

	let first = $state<State>('idle');
	let second = $state<State>('idle');

	const locked = $derived(first === 'running' || second === 'running');
</script>

{#snippet firstAction()}
	<button
		data-testid="first-action"
		disabled={locked}
		onclick={() => first = 'running'}
	>
		Run first
	</button>
{/snippet}

{#snippet secondAction()}
	<button
		data-testid="second-action"
		disabled={locked}
		onclick={() => second = 'running'}
	>
		Run second
	</button>
{/snippet}

{#snippet firstResult()}
	<span data-testid="first-result">First content</span>
{/snippet}

{#snippet secondResult()}
	<span data-testid="second-result">Second content</span>
{/snippet}

<div data-testid="two-panels">
	{#if first === 'idle'}
		<AsyncOperationPanel
			state="idle"
			title="First"
			action={firstAction}
		/>
	{:else if first === 'running'}
		<AsyncOperationPanel
			state="running"
			title="First"
			busyLabel="First running"
			action={firstAction}
		/>
	{:else}
		<AsyncOperationPanel
			state="success"
			title="First"
			message="First result"
			action={firstAction}
			result={firstResult}
		/>
	{/if}

	{#if second === 'idle'}
		<AsyncOperationPanel
			state="idle"
			title="Second"
			action={secondAction}
		/>
	{:else if second === 'running'}
		<AsyncOperationPanel
			state="running"
			title="Second"
			busyLabel="Second running"
			action={secondAction}
		/>
	{:else}
		<AsyncOperationPanel
			state="success"
			title="Second"
			message="Second result"
			action={secondAction}
			result={secondResult}
		/>
	{/if}

	<button data-testid="finish-first" onclick={() => first = 'success'}>
		Finish first
	</button>

	<button data-testid="finish-second" onclick={() => second = 'success'}>
		Finish second
	</button>
</div>
