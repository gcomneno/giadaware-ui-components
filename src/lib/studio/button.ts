import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'default' | 'compact';

export type ButtonProps = Omit<
	HTMLButtonAttributes,
	'children' | 'class' | 'style' | 'type'
> & {
	children: Snippet;
	variant?: ButtonVariant;
	size?: ButtonSize;
	type?: HTMLButtonAttributes['type'];
	class?: HTMLButtonAttributes['class'];
	style?: HTMLButtonAttributes['style'];
};

const BUTTON_VARIANTS: ReadonlySet<string> = new Set(['primary', 'secondary', 'danger']);
const BUTTON_SIZES: ReadonlySet<string> = new Set(['default', 'compact']);

export function normalizeButtonVariant(value: unknown): ButtonVariant {
	return typeof value === 'string' && BUTTON_VARIANTS.has(value)
		? (value as ButtonVariant)
		: 'primary';
}

export function normalizeButtonSize(value: unknown): ButtonSize {
	return typeof value === 'string' && BUTTON_SIZES.has(value)
		? (value as ButtonSize)
		: 'default';
}
