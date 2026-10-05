import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import RadioHydrationProbe from '../fixtures/RadioHydrationProbe.svelte';
import { RADIO_HYDRATION_SSR_BODY } from '../fixtures/radio-hydration-contract.js';

test('produces deterministic Radio hydration markup', () => {
	const first = render(RadioHydrationProbe);

	expect(first).toEqual(render(RadioHydrationProbe));
	expect(first.body).toBe(RADIO_HYDRATION_SSR_BODY);
	expect(first.body).toContain('data-selected="primary"');
	expect(first.body).toContain('data-count="0"');
	expect(first.body).toContain('name="hydrated"');
	expect(first.body).toContain('value="primary"');
	expect(first.body).toContain('value="secondary"');
	expect(first.body).toContain('checked=""');
	expect(first.body).toContain('Primary radio');
	expect(first.body).toContain('Secondary radio');
	expect(first.body.match(/<input/g)).toHaveLength(2);
	expect(first.body.match(/type="radio"/g)).toHaveLength(2);
	expect(first.body).not.toContain('role=');
});
