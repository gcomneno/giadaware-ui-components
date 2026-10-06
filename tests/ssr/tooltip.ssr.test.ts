import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import TooltipProbe from '../fixtures/TooltipProbe.svelte';

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
		throw new TypeError(`Missing attribute ${attribute}.`);
	}

	return match[1];
}

test('renders a deterministic tooltip relationship without manufacturing trigger semantics', () => {
	const first = render(TooltipProbe);
	const second = render(TooltipProbe);

	expect(first).toEqual(second);

	const trigger = getTag(
		first.body,
		'tooltip-trigger'
	);
	const tooltip = first.body.match(
		/<div[^>]*role="tooltip"[^>]*>/
	)?.[0];

	if (!tooltip) {
		throw new TypeError('Missing SSR tooltip.');
	}

	const describedBy = getAttribute(
		trigger,
		'aria-describedby'
	);
	const tooltipId = getAttribute(
		tooltip,
		'id'
	);

	expect(describedBy).toBe('help-tooltip');
	expect(tooltipId).toBe(describedBy);
	expect(tooltip).toContain('hidden');
	expect(first.body).toContain('Helpful information');

	expect(trigger).toContain('type="button"');
	expect(trigger).not.toContain('role="tooltip"');
});

test('composes consumer class and style on the tooltip element', () => {
	const { body } = render(TooltipProbe);

	expect(body).toContain('class="giu-tooltip');
});

test('starts hidden and does not manufacture live-region semantics', () => {
	const { body } = render(TooltipProbe);

	expect(body).toContain('role="tooltip"');
	expect(body).toContain('hidden');
	expect(body).not.toContain('aria-live');
	expect(body).not.toContain('role="status"');
	expect(body).not.toContain('role="alert"');
});
