import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	TOOLTIP_HYDRATION_SSR_BODY
} from '../fixtures/tooltip-hydration-contract.js';
import TooltipHydrationProbe from '../fixtures/TooltipHydrationProbe.svelte';

function getTag(body: string, testId: string): string {
	const match = body.match(
		new RegExp(`<[^>]*data-testid="${testId}"[^>]*>`)
	);

	if (!match) {
		throw new TypeError(`Missing SSR element ${testId}.`);
	}

	return match[0];
}

function getAttribute(tag: string, attribute: string): string {
	const match = tag.match(
		new RegExp(`\\s${attribute}="([^"]+)"`)
	);

	if (!match) {
		throw new TypeError(`Missing ${attribute}.`);
	}

	return match[1];
}

test('produces the canonical deterministic Tooltip hydration contract', () => {
	const first = render(TooltipHydrationProbe);
	const second = render(TooltipHydrationProbe);

	expect(first).toEqual(second);
	expect(first.body).toBe(
		TOOLTIP_HYDRATION_SSR_BODY
	);

	const trigger = getTag(
		first.body,
		'tooltip-hydration-trigger'
	);
	const describedBy = getAttribute(
		trigger,
		'aria-describedby'
	);

	expect(describedBy.length).toBeGreaterThan(0);
	expect(first.body).toContain(
		`id="${describedBy}"`
	);
	expect(first.body).toContain('role="tooltip"');
	expect(first.body).toContain('hidden');
	expect(first.body).toContain(
		'data-action-count="0"'
	);
});
