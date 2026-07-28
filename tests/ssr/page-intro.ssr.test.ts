import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import { PageIntro } from '../../src/lib/studio/index.js';

const plainChildren = createRawSnippet(() => ({
	render: () => 'Manage the current document.'
}));

const mixedChildren = createRawSnippet(() => ({
	render: () => 'Manage the document and <a href="/preview">open its preview</a>.'
}));

describe('PageIntro SSR', () => {
	test('renders deterministic semantic paragraph markup', () => {
		const first = render(PageIntro, { props: { children: plainChildren } });

		expect(first).toEqual(render(PageIntro, { props: { children: plainChildren } }));
		expect(first.body).toContain('<p');
		expect(first.body).toContain('giu-page-intro');
		expect(first.body).toContain('Manage the current document.');
		expect(first.body).not.toContain('role=');
		expect(first.body).not.toContain('aria-live=');
	});

	test('renders consumer-provided mixed snippet content unchanged', () => {
		const { body } = render(PageIntro, { props: { children: mixedChildren } });

		expect(body).toContain('Manage the document and');
		expect(body).toContain('<a href="/preview">open its preview</a>');
	});

	test('composes consumer class and forwards inline style', () => {
		const { body } = render(PageIntro, {
			props: {
				children: plainChildren,
				class: 'consumer-intro',
				style: '--giu-page-intro-margin: 0; color: navy'
			}
		});

		expect(body).toContain('giu-page-intro consumer-intro');
		expect(body).toContain('style="--giu-page-intro-margin: 0; color: navy"');
	});
});
