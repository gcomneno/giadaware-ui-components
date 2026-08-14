<script lang="ts">
	import { normalizeButtonSize, normalizeButtonVariant } from './button.js';
	import { normalizeIconButtonLabel } from './icon-button.js';

	import type { IconButtonProps as Props } from './icon-button.js';

	let {
		label,
		icon,
		variant = 'primary',
		size = 'default',
		type = 'button',
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	function sanitizeNativeAttributes<T extends object>(attributes: T): T {
		const sanitized = { ...attributes };

		Reflect.deleteProperty(sanitized, 'aria-label');
		Reflect.deleteProperty(sanitized, 'aria-labelledby');

		return sanitized;
	}

	const normalizedLabel = $derived(normalizeIconButtonLabel(label));
	const normalizedVariant = $derived(normalizeButtonVariant(variant));
	const normalizedSize = $derived(normalizeButtonSize(size));
</script>

{#if normalizedLabel}
	<button
		{...sanitizeNativeAttributes(nativeAttributes)}
		{type}
		aria-label={normalizedLabel}
		class={[
			'giu-icon-button',
			`giu-icon-button--${normalizedVariant}`,
			`giu-icon-button--${normalizedSize}`,
			className
		]}
		{style}
		data-giu-variant={normalizedVariant}
		data-giu-size={normalizedSize}
	>
		<span class="giu-icon-button__icon" aria-hidden="true">
			{@render icon()}
		</span>
	</button>
{/if}

<style>
	.giu-icon-button {
		display: inline-grid;
		place-items: center;
		box-sizing: border-box;
		width: var(--giu-icon-button-control-size, 2.75rem);
		min-width: var(--giu-icon-button-control-size, 2.75rem);
		min-height: var(--giu-icon-button-control-size, 2.75rem);
		padding: var(--giu-icon-button-padding, 0.5rem);
		border: var(--giu-icon-button-border-width, 1px) solid var(--giu-icon-button-border-color, #303030);
		border-radius: var(--giu-icon-button-border-radius, 0.5rem);
		color: var(--giu-icon-button-color, #ffffff);
		background: var(--giu-icon-button-background, #303030);
		font: inherit;
		line-height: 1;
		cursor: pointer;
	}

	.giu-icon-button__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.giu-icon-button--compact {
		width: var(--giu-icon-button-compact-control-size, 2.5rem);
		min-width: var(--giu-icon-button-compact-control-size, 2.5rem);
		min-height: var(--giu-icon-button-compact-control-size, 2.5rem);
		padding: var(--giu-icon-button-compact-padding, 0.375rem);
	}

	.giu-icon-button--secondary {
		--giu-icon-button-color: #202020;
		--giu-icon-button-background: #ffffff;
		--giu-icon-button-border-color: #5f5f5f;
	}

	.giu-icon-button--danger {
		--giu-icon-button-color: #8f1414;
		--giu-icon-button-background: #fff7f7;
		--giu-icon-button-border-color: #b42323;
	}

	.giu-icon-button:hover:not(:disabled) {
		color: var(--giu-icon-button-hover-color, var(--giu-icon-button-color, #ffffff));
		background: var(--giu-icon-button-hover-background, #171717);
		border-color: var(--giu-icon-button-hover-border-color, var(--giu-icon-button-border-color, #303030));
	}

	.giu-icon-button--secondary:hover:not(:disabled) {
		--giu-icon-button-hover-background: #eeeeee;
	}

	.giu-icon-button--danger:hover:not(:disabled) {
		--giu-icon-button-hover-background: #ffe7e7;
	}

	.giu-icon-button:active:not(:disabled) {
		color: var(--giu-icon-button-active-color, var(--giu-icon-button-hover-color, var(--giu-icon-button-color, #ffffff)));
		background: var(--giu-icon-button-active-background, #000000);
		border-color: var(--giu-icon-button-active-border-color, var(--giu-icon-button-hover-border-color, var(--giu-icon-button-border-color, #303030)));
	}

	.giu-icon-button--secondary:active:not(:disabled) {
		--giu-icon-button-active-background: #dddddd;
	}

	.giu-icon-button--danger:active:not(:disabled) {
		--giu-icon-button-active-background: #ffd5d5;
	}

	.giu-icon-button:focus-visible {
		outline: var(--giu-icon-button-focus-width, 3px) solid var(--giu-icon-button-focus-color, #1559a6);
		outline-offset: var(--giu-icon-button-focus-offset, 2px);
	}

	.giu-icon-button:disabled {
		opacity: var(--giu-icon-button-disabled-opacity, 0.55);
		cursor: not-allowed;
	}
</style>
