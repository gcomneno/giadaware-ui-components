import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { encodeTabsValue } from '../../src/lib/studio/tabs-internal.js';
import TabsProbe from '../fixtures/TabsProbe.svelte';

function tabTag(body: string, testId: string): string {
	const pattern = new RegExp(
		`<button[^>]*data-testid="${testId}"[^>]*>`
	);
	const match = body.match(pattern);

	if (!match) {
		throw new TypeError(`Missing SSR tab ${testId}.`);
	}

	return match[0];
}

function panelTag(body: string, testId: string): string {
	const pattern = new RegExp(
		`<div[^>]*data-testid="${testId}"[^>]*>`
	);
	const match = body.match(pattern);

	if (!match) {
		throw new TypeError(`Missing SSR panel ${testId}.`);
	}

	return match[0];
}

test('renders deterministic native tabs relationships from controlled state', () => {
	const first = render(TabsProbe);
	const second = render(TabsProbe);

	expect(first).toEqual(second);

	const overview = tabTag(first.body, 'tab-overview');
	const details = tabTag(first.body, 'tab-details');
	const logs = tabTag(first.body, 'tab-logs');

	const overviewPanel = panelTag(first.body, 'panel-overview');
	const detailsPanel = panelTag(first.body, 'panel-details');
	const logsPanel = panelTag(first.body, 'panel-logs');

	expect(first.body).toContain('id="settings-tabs"');
	expect(first.body).toContain('role="tablist"');
	expect(first.body).toContain('aria-orientation="horizontal"');

	expect(overview).toContain('role="tab"');
	expect(overview).toContain('aria-selected="true"');
	expect(overview).toContain('tabindex="0"');

	expect(details).toContain('aria-selected="false"');
	expect(details).toContain('tabindex="-1"');
	expect(logs).toContain('aria-selected="false"');
	expect(logs).toContain('tabindex="-1"');

	expect(overviewPanel).toContain('role="tabpanel"');
	expect(overviewPanel).toContain('tabindex="0"');
	expect(overviewPanel).not.toMatch(/\shidden(?:=|\s|>)/);

	expect(detailsPanel).toContain('hidden');
	expect(detailsPanel).not.toContain('tabindex=');
	expect(logsPanel).toContain('hidden');
	expect(logsPanel).not.toContain('tabindex=');

	const overviewSuffix = encodeTabsValue('overview');

	expect(overview).toContain(
		`id="settings-tabs-tab-${overviewSuffix}"`
	);
	expect(overview).toContain(
		`aria-controls="settings-tabs-panel-${overviewSuffix}"`
	);
	expect(overviewPanel).toContain(
		`id="settings-tabs-panel-${overviewSuffix}"`
	);
	expect(overviewPanel).toContain(
		`aria-labelledby="settings-tabs-tab-${overviewSuffix}"`
	);
});

test('renders vertical orientation and native disabled state deterministically', () => {
	const first = render(TabsProbe, {
		props: {
			orientation: 'vertical',
			disabledDetails: true
		}
	});
	const second = render(TabsProbe, {
		props: {
			orientation: 'vertical',
			disabledDetails: true
		}
	});

	expect(first).toEqual(second);
	expect(first.body).toContain('aria-orientation="vertical"');

	const details = tabTag(first.body, 'tab-details');

	expect(details).toContain('disabled');
	expect(details).toContain('aria-selected="false"');
	expect(details).toContain('tabindex="-1"');
});

test('does not repair an invalid controlled value during SSR', () => {
	const { body } = render(TabsProbe, {
		props: {
			initialValue: 'missing'
		}
	});

	expect(body).toContain('data-value="missing"');
	expect(body).toContain('data-requests="0"');
	expect(body).not.toContain('aria-selected="true"');
});

test('encodes raw tab values deterministically without collisions in representative edge cases', () => {
	const values = [
		'',
		'a',
		'a b',
		'a-b',
		'é',
		'e\u0301',
		'😀',
		'\ud800'
	];

	const encoded = values.map(encodeTabsValue);

	expect(new Set(encoded).size).toBe(values.length);
	expect(values.map(encodeTabsValue)).toEqual(encoded);
});
