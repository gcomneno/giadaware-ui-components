import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import PaginationProbe from '../fixtures/PaginationProbe.svelte';

test('renders deterministic pagination semantics and current page', () => {
	const first = render(PaginationProbe);
	const second = render(PaginationProbe);

	expect(first).toEqual(second);

	expect(first.body).toContain(
		'<nav aria-label="Results pages"'
	);
	expect(first.body).toContain(
		'data-giu-pagination-valid="true"'
	);

	expect(
		first.body.match(/aria-label="Go to page [1-4]"/g)
	).toHaveLength(4);

	expect(
		first.body.match(/aria-current="page"/g)
	).toHaveLength(1);

	expect(first.body).toMatch(
		/aria-label="Go to page 2"[^>]*aria-current="page"/
	);
});

test('disables the previous boundary on the first page', () => {
	const { body } = render(PaginationProbe, {
		props: {
			page: 1,
			pageCount: 4
		}
	});

	const previous = body.match(
		/<button[^>]*class="[^"]*\bgiu-pagination__control--previous\b[^"]*"[^>]*>/
	)?.[0];

	if (!previous) {
		throw new TypeError(
			'Missing previous pagination control.'
		);
	}

	expect(previous).toContain('disabled');
});

test('invalid controlled state renders fail-closed', () => {
	const { body } = render(PaginationProbe, {
		props: {
			page: 5,
			pageCount: 4
		}
	});

	expect(body).toContain(
		'data-giu-pagination-valid="false"'
	);

	const buttons = body.match(/<button[^>]*>/g) ?? [];

	expect(buttons.length).toBeGreaterThan(0);

	for (const button of buttons) {
		expect(button).toContain('disabled');
	}
});
