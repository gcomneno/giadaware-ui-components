<script lang="ts">
	import type { DisclosureProps as Props } from './disclosure.js';

	let {
		summary,
		children,
		open = $bindable(false),
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<details
	{...nativeAttributes}
	bind:open
	class={['giu-disclosure', className]}
	{style}
>
	<summary>
		{@render summary()}
	</summary>

	{@render children()}
</details>

<style>
	.giu-disclosure {
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-disclosure-padding, 0.75rem 1rem);
		border: var(--giu-disclosure-border-width, 1px) solid
			var(--giu-disclosure-border-color, #767676);
		border-radius: var(--giu-disclosure-border-radius, 0.5rem);
		color: var(--giu-disclosure-color, #202020);
		background: var(--giu-disclosure-background, #ffffff);
	}

	.giu-disclosure > summary {
		margin: calc(var(--giu-disclosure-padding-block-start, 0.75rem) * -1)
			calc(var(--giu-disclosure-padding-inline-end, 1rem) * -1)
			calc(var(--giu-disclosure-padding-block-end, 0.75rem) * -1)
			calc(var(--giu-disclosure-padding-inline-start, 1rem) * -1);
		padding: var(--giu-disclosure-summary-padding, 0.75rem 1rem);
		border-radius: var(--giu-disclosure-summary-border-radius, calc(var(--giu-disclosure-border-radius, 0.5rem) - var(--giu-disclosure-border-width, 1px)));
		font: inherit;
		font-weight: var(--giu-disclosure-summary-font-weight, 600);
		cursor: pointer;
	}

	.giu-disclosure[open] > summary {
		margin-bottom: var(--giu-disclosure-content-gap, 0.75rem);
	}

	.giu-disclosure > summary:focus-visible {
		outline: var(--giu-disclosure-focus-width, 3px) solid
			var(--giu-disclosure-focus-color, #1559a6);
		outline-offset: var(--giu-disclosure-focus-offset, 2px);
	}

	@media (forced-colors: active) {
		.giu-disclosure {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
		}

		.giu-disclosure > summary:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
