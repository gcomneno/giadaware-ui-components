import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import FormActionsHydrationProbe from '../fixtures/FormActionsHydrationProbe.svelte';
import { FORM_ACTIONS_HYDRATION_SSR_BODY } from '../fixtures/form-actions-hydration-contract.js';

test('produces deterministic FormActions hydration markup', () => {
	const first = render(FormActionsHydrationProbe);

	expect(first).toEqual(render(FormActionsHydrationProbe));
	expect(first.body).toBe(FORM_ACTIONS_HYDRATION_SSR_BODY);
});
