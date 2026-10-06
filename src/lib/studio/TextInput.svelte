<script lang="ts">
	import type { TextInputProps as Props } from './text-input.js';

	let {
		value = $bindable(''),
		type = 'text',
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<input
	{...nativeAttributes}
	{type}
	bind:value
	class={['giu-text-input', className]}
	{style}
/>

<style>
	.giu-text-input {
		box-sizing: border-box;
		display: inline-block;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		min-height: var(--giu-text-input-min-height, 2.75rem);
		margin: 0;
		padding: var(--giu-text-input-padding, 0.625rem 0.75rem);
		border: var(--giu-text-input-border-width, 1px) solid var(--giu-text-input-border-color, #555555);
		border-radius: var(--giu-text-input-border-radius, 0.375rem);
		color: var(--giu-text-input-color, #202020);
		background: var(--giu-text-input-background, #ffffff);
		font: inherit;
		line-height: 1.25;
		appearance: none;
	}

	.giu-text-input::placeholder {
		color: var(--giu-text-input-placeholder-color, #6f6f6f);
		opacity: 1;
	}

	.giu-text-input:hover:not(:disabled) {
		border-color: var(--giu-text-input-hover-border-color, #202020);
	}

	.giu-text-input:focus-visible {
		border-color: var(--giu-text-input-focus-border-color, #1559a6);
		outline: var(--giu-text-input-focus-width, 3px) solid var(--giu-text-input-focus-color, #1559a6);
		outline-offset: var(--giu-text-input-focus-offset, 2px);
	}

	.giu-text-input:disabled {
		opacity: var(--giu-text-input-disabled-opacity, 0.55);
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		.giu-text-input {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
		}

		.giu-text-input::placeholder {
			color: GrayText;
		}

		.giu-text-input:focus-visible {
			border-color: Highlight;
			outline-color: Highlight;
		}

		.giu-text-input:disabled {
			border-color: GrayText;
			color: GrayText;
			background: Canvas;
		}
	}
</style>
