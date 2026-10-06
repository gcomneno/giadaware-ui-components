<script lang="ts">
	import {
		useAccordionContext
	} from './accordion-internal.js';

	import type { AccordionItemProps as Props } from './accordion.js';

	let {
		summary,
		children,
		open = $bindable(false),
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	const accordion = useAccordionContext();
	const groupName = $derived(
		accordion.getGroupName()
	);
</script>

<details
	{...nativeAttributes}
	bind:open
	name={groupName}
	class={['giu-accordion-item', className]}
	{style}
>
	<summary class="giu-accordion-item__summary">
		{@render summary()}
	</summary>

	<div class="giu-accordion-item__content">
		{@render children()}
	</div>
</details>

<style>
	.giu-accordion-item {
		box-sizing: border-box;
		min-width: 0;
		border: var(--giu-accordion-border-width, 1px) solid
			var(--giu-accordion-border-color, #767676);
		border-radius: var(--giu-accordion-border-radius, 0.5rem);
		color: var(--giu-accordion-color, #202020);
		background: var(--giu-accordion-background, #ffffff);
	}

	.giu-accordion-item__summary {
		box-sizing: border-box;
		padding: var(--giu-accordion-summary-padding, 0.75rem 1rem);
		border-radius: var(
			--giu-accordion-summary-border-radius,
			calc(
				var(--giu-accordion-border-radius, 0.5rem) -
				var(--giu-accordion-border-width, 1px)
			)
		);
		font: inherit;
		font-weight: var(--giu-accordion-summary-font-weight, 600);
		cursor: pointer;
	}

	.giu-accordion-item__summary:focus-visible {
		outline: var(--giu-accordion-focus-width, 3px) solid
			var(--giu-accordion-focus-color, #1559a6);
		outline-offset: var(--giu-accordion-focus-offset, 2px);
	}

	.giu-accordion-item__content {
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-accordion-content-padding, 0 1rem 0.75rem);
	}

	@media (forced-colors: active) {
		.giu-accordion-item {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
		}

		.giu-accordion-item__summary:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
