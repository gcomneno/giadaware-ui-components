import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import HydrationProbe from '../fixtures/HydrationProbe.svelte';
import { HYDRATION_PROBE_SSR_BODY } from '../fixtures/hydration-probe-contract.js';

test('produces the deterministic hydration contract', () => {
	const first = render(HydrationProbe);
	const second = render(HydrationProbe);

	expect(first.body).toBe(second.body);
	expect(first.head).toBe(second.head);
	expect(first.body).toBe(HYDRATION_PROBE_SSR_BODY);
	expect(first.head).toBe('');
});
