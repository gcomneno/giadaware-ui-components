import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

import { Panel } from '../../src/lib/studio/index.js';

const children = createRawSnippet(() => ({
	render: () => '<form><button type="submit">Save</button></form>',
}));
const description = createRawSnippet(() => ({
	render: () => '<p>Consumer description</p>',
}));
const actions = createRawSnippet(() => ({
	render: () => '<a href="/edit">Edit</a>',
}));

describe('Panel SSR', () => {
	test('renders a deterministically named section with the default heading', () => {
		const first = render(Panel, {
			props: {
				title: 'Settings',
				children,
			},
		});

		expect(first).toEqual(
			render(Panel, {
				props: {
					title: 'Settings',
					children,
				},
			}),
		);

		const association = first.body.match(
			/<section id="([^"]+)"[^>]*aria-labelledby="\1-title"[^>]*>/,
		);

		expect(association).not.toBeNull();
		expect(first.body).toContain(`<h2 id="${association?.[1]}-title"`);
		expect(first.body).toContain(
			'<form><button type="submit">Save</button></form>',
		);
		expect(first.body).not.toContain('aria-live');
		expect(first.body).not.toContain('role=');
	});

	test('renders supplied ID, heading level and optional snippets in reading order', () => {
		const { body } = render(Panel, {
			props: {
				id: 'settings-panel',
				title: 'Settings',
				description,
				actions,
				children,
				headingLevel: 4,
				class: 'consumer-panel',
				style: 'max-width: 30rem',
			},
		});

		expect(body).toContain(
			'<section id="settings-panel" class="giu-panel consumer-panel',
		);
		expect(body).toContain('style="max-width: 30rem"');
		expect(body).toContain('aria-labelledby="settings-panel-title"');
		expect(body).toContain(
			'<h4 id="settings-panel-title" class="giu-panel__title',
		);

		const titleIndex = body.indexOf('Settings');
		const descriptionIndex = body.indexOf('Consumer description');
		const actionsIndex = body.indexOf('>Edit<');
		const childrenIndex = body.indexOf('>Save<');

		expect(titleIndex).toBeGreaterThanOrEqual(0);
		expect(descriptionIndex).toBeGreaterThan(titleIndex);
		expect(actionsIndex).toBeGreaterThan(descriptionIndex);
		expect(childrenIndex).toBeGreaterThan(actionsIndex);
	});
});
