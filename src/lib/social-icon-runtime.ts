import { DEV } from 'esm-env';

import { isSocialIconId } from './social-icon.js';
import { SOCIAL_ICON_PATHS } from './social-icon-paths.js';

import type { SocialIconId } from './social-icon.js';

export interface SocialIconRenderState {
	id: SocialIconId;
	path: string;
	ariaLabel?: string;
	title?: string;
}

const warnedConditions = new Set<string>();

function warnOnce(key: string, message: string): void {
	if (!DEV || warnedConditions.has(key)) {
		return;
	}

	warnedConditions.add(key);
	console.warn(`[giadaware-ui-components] ${message}`);
}

function nonEmptyText(value: string | undefined): string | undefined {
	const normalized = value?.trim();

	return normalized ? normalized : undefined;
}

export function resolveSocialIconRenderState(
	id: unknown,
	decorative: boolean,
	ariaLabel: string | undefined,
	title: string | undefined
): SocialIconRenderState | undefined {
	if (!isSocialIconId(id)) {
		warnOnce(
			`invalid-id:${String(id)}`,
			`SocialIcon received the unsupported id "${String(id)}"; no SVG was rendered.`
		);

		return undefined;
	}

	const normalizedAriaLabel = nonEmptyText(ariaLabel);

	if (!decorative && !normalizedAriaLabel) {
		warnOnce(
			`missing-label:${id}`,
			`SocialIcon "${id}" is informative but has no non-empty ariaLabel; no SVG was rendered.`
		);

		return undefined;
	}

	return {
		id,
		path: SOCIAL_ICON_PATHS[id],
		ariaLabel: decorative ? undefined : normalizedAriaLabel,
		title: decorative ? undefined : nonEmptyText(title)
	};
}

export function normalizeSocialIconDimension(
	value: number | string | undefined,
	fallback: string
): string {
	if (typeof value === 'number') {
		return Number.isFinite(value) && value > 0
			? `${value}px`
			: fallback;
	}

	if (typeof value === 'string') {
		const normalized = value.trim();

		return normalized || fallback;
	}

	return fallback;
}
