import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import IconButtonHydrationProbe from '../fixtures/IconButtonHydrationProbe.svelte';
import { ICON_BUTTON_HYDRATION_SSR_BODY } from '../fixtures/icon-button-hydration-contract.js';

test('produces deterministic IconButton hydration markup', () => {
	const first = render(IconButtonHydrationProbe);

	expect(first).toEqual(render(IconButtonHydrationProbe));
	expect(first.body).toBe(ICON_BUTTON_HYDRATION_SSR_BODY);
	expect(first.body).toContain('aria-label="Hydrated action"');
	expect(first.body).toContain('giu-icon-button__icon');
	expect(first.body.match(/aria-hidden="true"/g)).toHaveLength(2);
});
