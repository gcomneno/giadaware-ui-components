import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	MENU_BUTTON_HYDRATION_SSR_BODY
} from '../fixtures/menu-button-hydration-contract.js';
import MenuButtonHydrationProbe from '../fixtures/MenuButtonHydrationProbe.svelte';

function withoutEmptyHydrationMarkers(body: string): string {
	return body.replaceAll('<!---->', '');
}

test('produces canonical deterministic MenuButton hydration markup', () => {
	const first = render(MenuButtonHydrationProbe);
	const second = render(MenuButtonHydrationProbe);

	expect(first).toEqual(second);
	expect(
		withoutEmptyHydrationMarkers(first.body)
	).toBe(
		withoutEmptyHydrationMarkers(
			MENU_BUTTON_HYDRATION_SSR_BODY
		)
	);

	expect(first.body).toContain(
		'aria-haspopup="menu"'
	);
	expect(first.body).toContain(
		'aria-expanded="false"'
	);
	expect(first.body).toContain('role="menu"');
	expect(first.body).toContain('role="menuitem"');
	expect(first.body).toContain(
		'data-action-count="0"'
	);
});
