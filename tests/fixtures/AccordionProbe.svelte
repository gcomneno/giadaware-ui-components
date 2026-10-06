<script lang="ts">
	import Accordion from '../../src/lib/studio/Accordion.svelte';
	import AccordionItem from '../../src/lib/studio/AccordionItem.svelte';

	type Props = {
		multiple?: boolean;
		id?: string;
	};

	let {
		multiple = false,
		id = 'faq-accordion'
	}: Props = $props();

	let firstOpen = $state(false);
	let secondOpen = $state(false);
</script>

<div
	data-testid="accordion-probe"
	data-first-open={firstOpen}
	data-second-open={secondOpen}
>
	<Accordion {multiple} {id}>
		<AccordionItem
			bind:open={firstOpen}
			data-testid="accordion-first"
		>
			{#snippet summary()}
				First question
			{/snippet}

			<p>First answer</p>
		</AccordionItem>

		<AccordionItem
			bind:open={secondOpen}
			data-testid="accordion-second"
		>
			{#snippet summary()}
				Second question
			{/snippet}

			<p>Second answer</p>
		</AccordionItem>
	</Accordion>
</div>
