<script lang="ts">
	import type { SelectProps as Props } from './select.js';

	let {
		multiple = false,
		value = $bindable(multiple ? [] : undefined),
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

{#if multiple}
	<select
		{...nativeAttributes}
		multiple
		bind:value
		class={['giu-select', className]}
		{style}
	>
		{@render children()}
	</select>
{:else}
	<select
		{...nativeAttributes}
		bind:value
		class={['giu-select', className]}
		{style}
	>
		{@render children()}
	</select>
{/if}

<style>
	.giu-select {
		box-sizing: border-box;
		display: inline-block;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		min-height: var(--giu-select-min-height, 2.75rem);
		margin: 0;
		padding: var(--giu-select-padding, 0.625rem 2.25rem 0.625rem 0.75rem);
		border: var(--giu-select-border-width, 1px) solid var(--giu-select-border-color, #555555);
		border-radius: var(--giu-select-border-radius, 0.375rem);
		color: var(--giu-select-color, #202020);
		background-color: var(--giu-select-background, #ffffff);
		font: inherit;
		line-height: 1.25;
		appearance: auto;
		cursor: pointer;
	}

	.giu-select:hover:not(:disabled) {
		border-color: var(--giu-select-hover-border-color, #202020);
	}

	.giu-select:focus-visible {
		border-color: var(--giu-select-focus-border-color, #1559a6);
		outline: var(--giu-select-focus-width, 3px) solid var(--giu-select-focus-color, #1559a6);
		outline-offset: var(--giu-select-focus-offset, 2px);
	}

	.giu-select:disabled {
		opacity: var(--giu-select-disabled-opacity, 0.55);
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		.giu-select {
			border-color: CanvasText;
			color: CanvasText;
			background-color: Canvas;
		}

		.giu-select:focus-visible {
			border-color: Highlight;
			outline-color: Highlight;
		}

		.giu-select:disabled {
			border-color: GrayText;
			color: GrayText;
			background-color: Canvas;
		}
	}
</style>
