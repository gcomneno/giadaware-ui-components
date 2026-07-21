<script lang="ts">
	import { normalizeButtonSize, normalizeButtonVariant } from './button.js';

	import type { ButtonProps as Props } from './button.js';

	let {
		children,
		variant = 'primary',
		size = 'default',
		type = 'button',
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	const normalizedVariant = $derived(normalizeButtonVariant(variant));
	const normalizedSize = $derived(normalizeButtonSize(size));
</script>

<button
	{...nativeAttributes}
	{type}
	class={[
		'giu-button',
		`giu-button--${normalizedVariant}`,
		`giu-button--${normalizedSize}`,
		className
	]}
	{style}
	data-giu-variant={normalizedVariant}
	data-giu-size={normalizedSize}
>
	{@render children()}
</button>

<style>
	.giu-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		max-width: 100%;
		min-width: 0;
		min-height: 2.75rem;
		padding: var(--giu-button-padding, 0.625rem 1rem);
		border: var(--giu-button-border-width, 1px) solid var(--giu-button-border-color, #303030);
		border-radius: var(--giu-button-border-radius, 0.5rem);
		color: var(--giu-button-color, #ffffff);
		background: var(--giu-button-background, #303030);
		font: inherit;
		font-weight: var(--giu-button-font-weight, 600);
		line-height: 1.25;
		text-align: center;
		white-space: normal;
		overflow-wrap: anywhere;
		cursor: pointer;
	}

	.giu-button--compact {
		min-height: 2.5rem;
		padding: var(--giu-button-compact-padding, 0.4375rem 0.75rem);
	}

	.giu-button--secondary {
		--giu-button-color: #202020;
		--giu-button-background: #ffffff;
		--giu-button-border-color: #5f5f5f;
	}

	.giu-button--danger {
		--giu-button-color: #8f1414;
		--giu-button-background: #fff7f7;
		--giu-button-border-color: #b42323;
	}

	.giu-button:hover:not(:disabled) {
		color: var(--giu-button-hover-color, var(--giu-button-color, #ffffff));
		background: var(--giu-button-hover-background, #171717);
		border-color: var(--giu-button-hover-border-color, var(--giu-button-border-color, #303030));
	}

	.giu-button--secondary:hover:not(:disabled) {
		--giu-button-hover-background: #eeeeee;
	}

	.giu-button--danger:hover:not(:disabled) {
		--giu-button-hover-background: #ffe7e7;
	}

	.giu-button:active:not(:disabled) {
		color: var(--giu-button-active-color, var(--giu-button-hover-color, var(--giu-button-color, #ffffff)));
		background: var(--giu-button-active-background, #000000);
		border-color: var(--giu-button-active-border-color, var(--giu-button-hover-border-color, var(--giu-button-border-color, #303030)));
	}

	.giu-button--secondary:active:not(:disabled) {
		--giu-button-active-background: #dddddd;
	}

	.giu-button--danger:active:not(:disabled) {
		--giu-button-active-background: #ffd5d5;
	}

	.giu-button:focus-visible {
		outline: var(--giu-button-focus-width, 3px) solid var(--giu-button-focus-color, #1559a6);
		outline-offset: var(--giu-button-focus-offset, 2px);
	}

	.giu-button:disabled {
		opacity: var(--giu-button-disabled-opacity, 0.55);
		cursor: not-allowed;
	}
</style>
