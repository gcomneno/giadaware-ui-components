import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

import { Surface } from '../../src/lib/studio/index.js';

const children = createRawSnippet(() => ({
	render: () =>
		'<nav aria-label="Resources"><a href="/docs">Documentation</a></nav>',
}));

describe('Surface SSR', () => {
	test('renders one deterministic neutral div with consumer content', () => {
		const first = render(Surface, {
			props: {
				children,
			},
		});

		expect(first).toEqual(
			render(Surface, {
				props: {
					children,
				},
			}),
		);

		expect(first.body).toContain('<div class="giu-surface');
		expect(first.body).toContain(
			'<nav aria-label="Resources"><a href="/docs">Documentation</a></nav>',
		);
		expect(first.body).not.toContain('<section');
		expect(first.body).not.toContain('<header');
		expect(first.body).not.toContain('<h1');
		expect(first.body).not.toContain('<h2');
		expect(first.body).not.toContain(' role=');
		expect(first.body).not.toContain('aria-labelledby');
		expect(first.body).not.toContain('aria-label="Settings"');
	});

	test('forwards consumer class and style without adding semantics', () => {
		const { body } = render(Surface, {
			props: {
				children,
				class: 'consumer-surface',
				style: '--giu-surface-padding: 2rem; max-width: 30rem',
			},
		});

		expect(body).toContain('<div class="giu-surface consumer-surface');
		expect(body).toContain(
			'style="--giu-surface-padding: 2rem; max-width: 30rem"',
		);

		const rootOpeningTag = body.match(/<div[^>]*>/)?.[0];

		expect(rootOpeningTag).toBeTruthy();
		expect(rootOpeningTag).not.toContain('role=');
		expect(rootOpeningTag).not.toContain('aria-');
		expect(body).toContain('<nav aria-label="Resources">');
	});
});
