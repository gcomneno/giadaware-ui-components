<script lang="ts">
	import type { RadioProps as Props } from './radio.js';

	let {
		group = $bindable(),
		value,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<input
	{...nativeAttributes}
	type="radio"
	{value}
	bind:group
	class={['giu-radio', className]}
	{style}
/>

<style>
	.giu-radio {
		box-sizing: border-box;
		display: inline-grid;
		flex: 0 0 auto;
		place-content: center;
		width: var(--giu-radio-size, 1.125rem);
		height: var(--giu-radio-size, 1.125rem);
		margin: 0;
		border: var(--giu-radio-border-width, 2px) solid var(--giu-radio-border-color, #555555);
		border-radius: 50%;
		background: var(--giu-radio-background, #ffffff);
		font: inherit;
		vertical-align: text-bottom;
		appearance: none;
		cursor: pointer;
	}

	.giu-radio::before {
		content: "";
		box-sizing: border-box;
		width: var(--giu-radio-dot-size, 0.5rem);
		height: var(--giu-radio-dot-size, 0.5rem);
		border-radius: 50%;
		background: var(--giu-radio-checked-color, #303030);
		transform: scale(0);
	}

	.giu-radio:checked {
		border-color: var(--giu-radio-checked-border-color, #303030);
	}

	.giu-radio:checked::before {
		transform: scale(1);
	}

	.giu-radio:hover:not(:disabled) {
		border-color: var(--giu-radio-hover-border-color, #202020);
	}

	.giu-radio:focus-visible {
		outline: var(--giu-radio-focus-width, 3px) solid var(--giu-radio-focus-color, #1559a6);
		outline-offset: var(--giu-radio-focus-offset, 2px);
	}

	.giu-radio:disabled {
		opacity: var(--giu-radio-disabled-opacity, 0.55);
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		.giu-radio {
			border-color: CanvasText;
			background: Canvas;
		}

		.giu-radio::before {
			background: Highlight;
		}

		.giu-radio:checked {
			border-color: Highlight;
		}

		.giu-radio:focus-visible {
			outline-color: Highlight;
		}

		.giu-radio:disabled {
			border-color: GrayText;
			background: Canvas;
		}

		.giu-radio:disabled::before {
			background: GrayText;
		}
	}
</style>
