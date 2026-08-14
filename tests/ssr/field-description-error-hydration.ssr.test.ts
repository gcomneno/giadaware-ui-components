import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { FIELD_DESCRIPTION_ERROR_HYDRATION_SSR_BODY } from '../fixtures/field-description-error-hydration-contract.js';
import FieldDescriptionErrorHydrationProbe from '../fixtures/FieldDescriptionErrorHydrationProbe.svelte';

test('produces deterministic FieldDescription and FieldError hydration markup', () => {
	const first = render(FieldDescriptionErrorHydrationProbe);
	const second = render(FieldDescriptionErrorHydrationProbe);

	expect(first).toEqual(second);
	expect(first.body).toBe(
		FIELD_DESCRIPTION_ERROR_HYDRATION_SSR_BODY
	);
	expect(first.head).toBe('');

	expect(
		first.body.match(/class="giu-field-description/g)
	).toHaveLength(1);

	expect(
		first.body.match(/class="giu-field-error/g)
	).toHaveLength(1);

	expect(first.body).toContain(
		'aria-describedby="hydration-email-description"'
	);
	expect(first.body).toContain(
		'aria-describedby="hydration-code-error"'
	);

	expect(first.body).not.toContain('role="alert"');
	expect(first.body).not.toContain('aria-live=');
	expect(first.body).not.toContain(
		'aria-errormessage="hydration-dynamic-error"'
	);
	expect(first.body).not.toContain(
		'id="hydration-dynamic-error"'
	);
});
