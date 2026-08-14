import { DEV } from 'esm-env';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

import type { ButtonSize, ButtonVariant } from './button.js';

export type IconButtonProps = Omit<
	HTMLButtonAttributes,
	'children' | 'class' | 'style' | 'type' | 'aria-label' | 'aria-labelledby'
> & {
	label: string;
	icon: Snippet;
	variant?: ButtonVariant;
	size?: ButtonSize;
	type?: HTMLButtonAttributes['type'];
	class?: HTMLButtonAttributes['class'];
	style?: HTMLButtonAttributes['style'];
};

let warnedMissingLabel = false;

export function normalizeIconButtonLabel(value: unknown): string | undefined {
	const normalized = typeof value === 'string' ? value.trim() : '';

	if (normalized) {
		return normalized;
	}

	if (DEV && !warnedMissingLabel) {
		warnedMissingLabel = true;
		console.warn(
			'[giadaware-ui-components] IconButton requires a non-empty label; no button was rendered.'
		);
	}

	return undefined;
}
