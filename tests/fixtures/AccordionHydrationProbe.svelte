<script lang="ts">
	import Accordion from '../../src/lib/studio/Accordion.svelte';
	import AccordionItem from '../../src/lib/studio/AccordionItem.svelte';

	let firstOpen = $state(true);
	let secondOpen = $state(false);
	let actionCount = $state(0);
</script>

<div
	data-testid="accordion-hydration-probe"
	data-first-open={firstOpen}
	data-second-open={secondOpen}
	data-action-count={actionCount}
>
	<Accordion>
		<AccordionItem
			bind:open={firstOpen}
			data-testid="accordion-hydration-first"
		>
			{#snippet summary()}
				Hydration first
			{/snippet}

			<button
				type="button"
				data-testid="accordion-hydration-action"
				onclick={() => actionCount += 1}
			>
				Action
			</button>
		</AccordionItem>

		<AccordionItem
			bind:open={secondOpen}
			data-testid="accordion-hydration-second"
		>
			{#snippet summary()}
				Hydration second
			{/snippet}

			<p>Second hydration content</p>
		</AccordionItem>
	</Accordion>
</div>
