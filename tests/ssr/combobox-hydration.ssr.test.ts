import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	COMBOBOX_HYDRATION_SSR_BODY
} from '../fixtures/combobox-hydration-contract.js';
import ComboboxHydrationProbe from '../fixtures/ComboboxHydrationProbe.svelte';

function withoutEmptyHydrationMarkers(
	body: string
): string {
	return body.replaceAll('<!---->', '');
}

test('renders deterministic Combobox hydration state', () => {
	const first = render(ComboboxHydrationProbe);
	const second = render(ComboboxHydrationProbe);

	expect(first).toEqual(second);

	expect(
		withoutEmptyHydrationMarkers(first.body)
	).toBe(
		withoutEmptyHydrationMarkers(
			COMBOBOX_HYDRATION_SSR_BODY
		)
	);

	expect(first.body).toContain(
		'aria-expanded="false"'
	);
	expect(first.body).not.toContain(
		'aria-activedescendant='
	);
	expect(first.body).toContain(
		'data-query="Alpha"'
	);
	expect(first.body).toContain(
		'data-value="alpha"'
	);
});
