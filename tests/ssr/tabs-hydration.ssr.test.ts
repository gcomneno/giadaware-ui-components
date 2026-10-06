import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	TABS_HYDRATION_SSR_BODY
} from '../fixtures/tabs-hydration-contract.js';
import TabsHydrationProbe from '../fixtures/TabsHydrationProbe.svelte';

function getAttribute(
	body: string,
	testId: string,
	attribute: string
): string {
	const elementPattern = new RegExp(
		`<[^>]*data-testid="${testId}"[^>]*>`
	);
	const element = body.match(elementPattern)?.[0];

	if (!element) {
		throw new TypeError(`Missing SSR element ${testId}.`);
	}

	const attributePattern = new RegExp(
		`\\s${attribute}="([^"]+)"`
	);
	const value = element.match(attributePattern)?.[1];

	if (!value) {
		throw new TypeError(
			`Missing ${attribute} on SSR element ${testId}.`
		);
	}

	return value;
}

test('produces the canonical deterministic Tabs hydration contract', () => {
	const first = render(TabsHydrationProbe);
	const second = render(TabsHydrationProbe);

	expect(first).toEqual(second);
	expect(first.body).toBe(TABS_HYDRATION_SSR_BODY);

	expect(first.body).toContain('role="tablist"');
	expect(first.body).toContain('aria-orientation="horizontal"');
	expect(first.body).toContain('role="tab"');
	expect(first.body).toContain('role="tabpanel"');
	expect(first.body).toContain('data-value="overview"');
	expect(first.body).toContain('data-requests="0"');

	const rootId = getAttribute(
		first.body,
		'tabs-hydration-root',
		'id'
	);
	const overviewId = getAttribute(
		first.body,
		'tabs-hydration-overview',
		'id'
	);
	const overviewPanelId = getAttribute(
		first.body,
		'tabs-hydration-overview-panel',
		'id'
	);

	expect(rootId.length).toBeGreaterThan(0);
	expect(overviewId).toMatch(
		new RegExp(`^${rootId}-tab-`)
	);
	expect(overviewPanelId).toMatch(
		new RegExp(`^${rootId}-panel-`)
	);

	expect(first.body).toContain(
		`aria-controls="${overviewPanelId}"`
	);
	expect(first.body).toContain(
		`aria-labelledby="${overviewId}"`
	);
});

test('keeps controlled selection fully represented in SSR markup', () => {
	const { body } = render(TabsHydrationProbe);

	expect(body).toMatch(
		/data-testid="tabs-hydration-overview"[^>]*aria-selected="true"/
	);
	expect(body).toMatch(
		/data-testid="tabs-hydration-overview"[^>]*tabindex="0"/
	);
	expect(body).toMatch(
		/data-testid="tabs-hydration-details"[^>]*aria-selected="false"/
	);
	expect(body).toMatch(
		/data-testid="tabs-hydration-details-panel"[^>]*hidden/
	);
});
