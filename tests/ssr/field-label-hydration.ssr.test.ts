import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { FIELD_LABEL_HYDRATION_SSR_BODY } from '../fixtures/field-label-hydration-contract.js';
import FieldLabelHydrationProbe from '../fixtures/FieldLabelHydrationProbe.svelte';

test('produces deterministic FieldLabel hydration markup', () => {
	const first = render(FieldLabelHydrationProbe);

	expect(first).toEqual(render(FieldLabelHydrationProbe));
	expect(first.body).toBe(FIELD_LABEL_HYDRATION_SSR_BODY);

	expect(
		first.body.match(/class="giu-field-label-row/g),
	).toHaveLength(4);

	expect(
		first.body.match(/giu-field-label-marker--required/g),
	).toHaveLength(2);

	expect(
		first.body.match(/giu-field-label-marker--optional/g),
	).toHaveLength(1);

	expect(first.body).toContain(
		'id="hydration-email-hint"',
	);

	expect(first.body).not.toContain('unused-hint');
	expect(first.body).not.toContain('<label class="giu-field-label');
});
