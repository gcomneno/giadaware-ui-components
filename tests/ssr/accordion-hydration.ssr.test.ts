import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	ACCORDION_HYDRATION_SSR_BODY
} from '../fixtures/accordion-hydration-contract.js';
import AccordionHydrationProbe from '../fixtures/AccordionHydrationProbe.svelte';

function withoutEmptyHydrationMarkers(
	body: string
): string {
	return body.replaceAll('<!---->', '');
}

test('renders deterministic initial Accordion hydration state', () => {
	const first = render(AccordionHydrationProbe);
	const second = render(AccordionHydrationProbe);

	expect(first).toEqual(second);

	expect(
		withoutEmptyHydrationMarkers(first.body)
	).toBe(
		withoutEmptyHydrationMarkers(
			ACCORDION_HYDRATION_SSR_BODY
		)
	);

	expect(
		first.body.match(/<details/g)
	).toHaveLength(2);
	expect(
		first.body.match(/<details[^>]* open/g)
	).toHaveLength(1);

	expect(first.body).toContain(
		'data-first-open="true"'
	);
	expect(first.body).toContain(
		'data-second-open="false"'
	);
	expect(first.body).toContain(
		'data-action-count="0"'
	);
});
