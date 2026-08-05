import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { EDITABLE_LIST_HYDRATION_SSR_BODY } from '../fixtures/editable-list-hydration-contract.js';
import EditableListHydrationProbe from '../fixtures/EditableListHydrationProbe.svelte';

test('produces deterministic EditableList hydration markup', () => {
	const first = render(EditableListHydrationProbe);

	expect(first).toEqual(render(EditableListHydrationProbe));
	expect(first.body).toBe(EDITABLE_LIST_HYDRATION_SSR_BODY);
	expect(first.body).toContain('<fieldset');
	expect(first.body).toContain('<ol class="giu-editable-list__rows');
	expect(first.body).toContain('<li class="giu-editable-list-row');
	expect(first.body.match(/type="button"/g)).toHaveLength(2);
});
