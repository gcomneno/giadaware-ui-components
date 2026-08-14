import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import ButtonHydrationProbe from '../fixtures/ButtonHydrationProbe.svelte';
import { BUTTON_HYDRATION_SSR_BODY } from '../fixtures/button-hydration-contract.js';

test('produces deterministic Button hydration markup', () => {
	const first = render(ButtonHydrationProbe);
	expect(first).toEqual(render(ButtonHydrationProbe));
	expect(first.body).toBe(BUTTON_HYDRATION_SSR_BODY);
	expect(first.body).toContain('giu-button__leading');
	expect(first.body).toContain('giu-button__label');
	expect(first.body).toContain('giu-button__trailing');
	expect(first.body.indexOf('Hydrated leading')).toBeLessThan(
		first.body.indexOf('Hydrated action'),
	);
	expect(first.body.indexOf('Hydrated trailing')).toBeGreaterThan(
		first.body.indexOf('Hydrated action'),
	);
});
