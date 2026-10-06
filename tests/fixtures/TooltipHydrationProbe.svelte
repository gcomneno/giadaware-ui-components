<script lang="ts">
	import Tooltip from '../../src/lib/studio/Tooltip.svelte';

	let actionCount = $state(0);
</script>

<div
	data-testid="tooltip-hydration-probe"
	data-action-count={actionCount}
>
	<Tooltip>
		{#snippet trigger(props)}
			<button
				type="button"
				data-testid="tooltip-hydration-trigger"
				{...props}
				onclick={() => actionCount += 1}
			>
				Hydration help
			</button>
		{/snippet}

		<span data-testid="tooltip-hydration-content">
			Hydration tooltip
		</span>
	</Tooltip>
</div>
