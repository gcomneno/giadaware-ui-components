<script lang="ts">
	import Panel from '../../src/lib/studio/Panel.svelte';
	import type { PanelHeadingLevel } from '../../src/lib/studio/panel.js';

	let actionCount = $state(0);
	const headingLevels: PanelHeadingLevel[] = [2, 3, 4, 5, 6];
</script>

<div data-testid="panel-probe" data-action-count={actionCount}>
	<Panel title="Default panel">
		<p data-testid="default-body">Default body</p>
	</Panel>

	<Panel
		id="complete-panel"
		title="Complete panel"
		headingLevel={3}
		class="consumer-panel"
		style="max-width: 30rem"
	>
		{#snippet description()}
			<p data-testid="panel-description">Consumer description</p>
		{/snippet}

		{#snippet actions()}
			<button
				type="button"
				data-testid="panel-action"
				onclick={() => actionCount += 1}
			>
				Run action
			</button>
		{/snippet}

		{#snippet footer()}
			<div data-testid="panel-footer">
				<span>
					Consumer-owned footer content remains usable when the panel becomes narrow.
				</span>
				<button
					type="button"
					data-testid="panel-footer-action"
					onclick={() => actionCount += 1}
				>
					Footer action
				</button>
			</div>
		{/snippet}

		<form
			data-testid="panel-body"
			onsubmit={(event) => {
				event.preventDefault();
				actionCount += 1;
			}}
		>
			<button type="submit">Submit body</button>
		</form>
	</Panel>

	{#each headingLevels as level}
		<Panel title={`Level ${level}`} headingLevel={level}>
			<span>Level {level} body</span>
		</Panel>
	{/each}
</div>
