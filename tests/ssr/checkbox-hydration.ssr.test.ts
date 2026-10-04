import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import CheckboxHydrationProbe from '../fixtures/CheckboxHydrationProbe.svelte';
import { CHECKBOX_HYDRATION_SSR_BODY } from '../fixtures/checkbox-hydration-contract.js';

test('produces deterministic Checkbox hydration markup', () => {
	const first = render(CheckboxHydrationProbe);
	expect(first).toEqual(render(CheckboxHydrationProbe));
	expect(first.body).toBe(CHECKBOX_HYDRATION_SSR_BODY);
	expect(first.body).toContain('data-checked="true"');
	expect(first.body).toContain('data-count="0"');
	expect(first.body).toContain('name="hydrated"');
	expect(first.body).toContain('value="yes"');
	expect(first.body).toContain('checked=""');
	expect(first.body).toContain('Hydrated checkbox');
	expect(first.body).toContain('Secondary checkbox');
	expect(first.body.match(/<input/g)).toHaveLength(2);
	expect(first.body.match(/type="checkbox"/g)).toHaveLength(2);
	expect(first.body).not.toContain('role=');
});
