<script lang="ts">
	import type { TextareaProps as Props } from './textarea.js';

	let {
		value = $bindable(''),
		resize = 'block',
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<textarea
	{...nativeAttributes}
	bind:value
	class={['giu-textarea', `giu-textarea--resize-${resize}`, className]}
	{style}
></textarea>

<style>
	.giu-textarea {
		box-sizing: border-box;
		display: block;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		min-height: var(--giu-textarea-min-height, 7rem);
		margin: 0;
		padding: var(--giu-textarea-padding, 0.625rem 0.75rem);
		border: var(--giu-textarea-border-width, 1px) solid var(--giu-textarea-border-color, #555555);
		border-radius: var(--giu-textarea-border-radius, 0.375rem);
		color: var(--giu-textarea-color, #202020);
		background: var(--giu-textarea-background, #ffffff);
		font: inherit;
		line-height: 1.4;
		appearance: none;
	}

	.giu-textarea::placeholder {
		color: var(--giu-textarea-placeholder-color, #6f6f6f);
		opacity: 1;
	}

	.giu-textarea--resize-block {
		resize: vertical;
	}

	.giu-textarea--resize-inline {
		resize: horizontal;
	}

	.giu-textarea--resize-both {
		resize: both;
	}

	.giu-textarea--resize-none {
		resize: none;
	}

	.giu-textarea:hover:not(:disabled) {
		border-color: var(--giu-textarea-hover-border-color, #202020);
	}

	.giu-textarea:focus-visible {
		border-color: var(--giu-textarea-focus-border-color, #1559a6);
		outline: var(--giu-textarea-focus-width, 3px) solid var(--giu-textarea-focus-color, #1559a6);
		outline-offset: var(--giu-textarea-focus-offset, 2px);
	}

	.giu-textarea:disabled {
		opacity: var(--giu-textarea-disabled-opacity, 0.55);
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		.giu-textarea {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
		}

		.giu-textarea::placeholder {
			color: GrayText;
		}

		.giu-textarea:focus-visible {
			border-color: Highlight;
			outline-color: Highlight;
		}

		.giu-textarea:disabled {
			border-color: GrayText;
			color: GrayText;
			background: Canvas;
		}
	}
</style>
