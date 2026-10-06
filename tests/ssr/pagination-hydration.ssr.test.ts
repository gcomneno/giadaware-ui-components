import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	PAGINATION_HYDRATION_SSR_BODY
} from '../fixtures/pagination-hydration-contract.js';
import PaginationHydrationProbe from '../fixtures/PaginationHydrationProbe.svelte';

function withoutEmptyHydrationMarkers(
	body: string
): string {
	return body.replaceAll('<!---->', '');
}

test('renders deterministic Pagination hydration state', () => {
	const first = render(PaginationHydrationProbe);
	const second = render(PaginationHydrationProbe);

	expect(first).toEqual(second);

	expect(
		withoutEmptyHydrationMarkers(first.body)
	).toBe(
		withoutEmptyHydrationMarkers(
			PAGINATION_HYDRATION_SSR_BODY
		)
	);

	expect(first.body).toContain(
		'data-page="2"'
	);
	expect(first.body).toContain(
		'data-request-count="0"'
	);
	expect(
		first.body.match(/aria-current="page"/g)
	).toHaveLength(1);
});
