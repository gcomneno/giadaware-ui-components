<script lang="ts">
	import Panel from '../../src/lib/studio/Panel.svelte';

	let actionCount = $state(0);
</script>

<div
	data-testid="panel-hydration-probe"
	data-action-count={actionCount}
>
	<Panel title="Generated panel">
		{#snippet description()}
			<p>Generated description</p>
		{/snippet}

		{#snippet actions()}
			<button
				type="button"
				onclick={() => actionCount += 1}
			>
				Generated action
			</button>
		{/snippet}

		{#snippet footer()}
			<button
				type="button"
				onclick={() => actionCount += 1}
			>
				Generated footer action
			</button>
		{/snippet}

		<p>Generated body</p>
	</Panel>

	<Panel
		id="fixed-panel"
		title="Fixed panel"
		headingLevel={4}
	>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				actionCount += 1;
			}}
		>
			<button type="submit">Submit fixed</button>
		</form>
	</Panel>
</div>
