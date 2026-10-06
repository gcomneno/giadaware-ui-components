import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	SIMPLE_PRIMITIVES_HYDRATION_SSR_BODY
} from '../fixtures/simple-primitives-hydration-contract.js';
import SimplePrimitivesHydrationProbe from '../fixtures/SimplePrimitivesHydrationProbe.svelte';

function withoutEmptyHydrationMarkers(
	body: string
): string {
	return body.replaceAll('<!---->', '');
}

test('renders deterministic simple-primitives hydration state', () => {
	const first = render(SimplePrimitivesHydrationProbe);
	const second = render(SimplePrimitivesHydrationProbe);

	expect(first).toEqual(second);

	expect(
		withoutEmptyHydrationMarkers(first.body)
	).toBe(
		withoutEmptyHydrationMarkers(
			SIMPLE_PRIMITIVES_HYDRATION_SSR_BODY
		)
	);

	expect(first.body).toContain(
		'data-text="server text"'
	);
	expect(first.body).toContain(
		'data-textarea="server notes"'
	);
	expect(first.body).toContain(
		'data-select="beta"'
	);
	expect(first.body).toContain(
		'data-open="true"'
	);
});
