import { DEV } from 'esm-env';
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';

import { isSocialIconId } from './social-icon.js';

import type { SocialIconId } from './social-icon.js';

export type SocialLinkProps = Omit<
	HTMLAnchorAttributes,
	'children' | 'href' | 'class' | 'style' | 'aria-label' | 'aria-labelledby'
> & {
	id: SocialIconId;
	href: string;
	iconSize?: number | string;
	label?: string;
	children?: Snippet;
	class?: HTMLAnchorAttributes['class'];
	style?: HTMLAnchorAttributes['style'];
};

const warnedConditions = new Set<string>();

function warnOnce(key: string, message: string): void {
	if (!DEV || warnedConditions.has(key)) {
		return;
	}

	warnedConditions.add(key);
	console.warn(`[giadaware-ui-components] ${message}`);
}

export function normalizeSocialLinkHref(value: unknown): string | undefined {
	const normalized = typeof value === 'string' ? value.trim() : '';

	if (normalized && typeof value === 'string') {
		return value;
	}

	warnOnce(
		'missing-href',
		'SocialLink requires a non-empty href; no anchor was rendered.'
	);

	return undefined;
}

export function resolveSocialLinkRenderState(
	id: unknown,
	hasVisibleLabel: boolean,
	label: unknown
): { id: SocialIconId; ariaLabel?: string } | undefined {
	if (!isSocialIconId(id)) {
		warnOnce(
			`invalid-id:${String(id)}`,
			`SocialLink received the unsupported id "${String(id)}"; no anchor was rendered.`
		);

		return undefined;
	}

	if (hasVisibleLabel) {
		return { id };
	}

	const normalizedLabel =
		typeof label === 'string' ? label.trim() : '';

	if (!normalizedLabel) {
		warnOnce(
			`missing-label:${id}`,
			`SocialLink "${id}" is icon-only but has no non-empty label; no anchor was rendered.`
		);

		return undefined;
	}

	return {
		id,
		ariaLabel: normalizedLabel
	};
}
