<script lang="ts">
	import type { CheckboxProps as Props } from './checkbox.js';

	let {
		checked = $bindable(false),
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<input
	{...nativeAttributes}
	type="checkbox"
	bind:checked
	class={['giu-checkbox', className]}
	{style}
/>

<style>
	.giu-checkbox {
		box-sizing: border-box;
		display: inline-grid;
		flex: 0 0 auto;
		place-content: center;
		width: var(--giu-checkbox-size, 1.125rem);
		height: var(--giu-checkbox-size, 1.125rem);
		margin: 0;
		border: var(--giu-checkbox-border-width, 2px) solid var(--giu-checkbox-border-color, #555555);
		border-radius: var(--giu-checkbox-border-radius, 0.25rem);
		color: var(--giu-checkbox-color, #ffffff);
		background: var(--giu-checkbox-background, #ffffff);
		font: inherit;
		vertical-align: text-bottom;
		appearance: none;
		cursor: pointer;
	}

	.giu-checkbox::after {
		content: "";
		box-sizing: border-box;
		width: calc(var(--giu-checkbox-size, 1.125rem) * 0.32);
		height: calc(var(--giu-checkbox-size, 1.125rem) * 0.58);
		margin-top: calc(var(--giu-checkbox-size, 1.125rem) * -0.08);
		border-right: max(2px, calc(var(--giu-checkbox-size, 1.125rem) * 0.12)) solid currentColor;
		border-bottom: max(2px, calc(var(--giu-checkbox-size, 1.125rem) * 0.12)) solid currentColor;
		opacity: 0;
		transform: rotate(45deg);
	}

	.giu-checkbox:checked {
		color: var(--giu-checkbox-checked-color, #ffffff);
		background: var(--giu-checkbox-checked-background, #303030);
		border-color: var(--giu-checkbox-checked-border-color, #303030);
	}

	.giu-checkbox:checked::after {
		opacity: 1;
	}

	.giu-checkbox:hover:not(:disabled) {
		background: var(--giu-checkbox-hover-background, var(--giu-checkbox-background, #ffffff));
		border-color: var(--giu-checkbox-hover-border-color, #202020);
	}

	.giu-checkbox:checked:hover:not(:disabled) {
		background: var(--giu-checkbox-hover-background, var(--giu-checkbox-checked-background, #303030));
		border-color: var(--giu-checkbox-hover-border-color, var(--giu-checkbox-checked-border-color, #303030));
	}

	.giu-checkbox:focus-visible {
		outline: var(--giu-checkbox-focus-width, 3px) solid var(--giu-checkbox-focus-color, #1559a6);
		outline-offset: var(--giu-checkbox-focus-offset, 2px);
	}

	.giu-checkbox:disabled {
		opacity: var(--giu-checkbox-disabled-opacity, 0.55);
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		.giu-checkbox {
			border-color: CanvasText;
			background: Canvas;
			color: Canvas;
		}

		.giu-checkbox:checked {
			border-color: Highlight;
			background: Highlight;
			color: HighlightText;
		}

		.giu-checkbox:focus-visible {
			outline-color: Highlight;
		}

		.giu-checkbox:disabled {
			border-color: GrayText;
			background: Canvas;
			color: GrayText;
		}
	}
</style>
