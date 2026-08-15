import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import {
	EDITABLE_LIST_DRAG_HYDRATION_SSR_BODY,
	EDITABLE_LIST_HYDRATION_SSR_BODY
} from '../fixtures/editable-list-hydration-contract.js';
import EditableListDragHydrationProbe from '../fixtures/EditableListDragHydrationProbe.svelte';
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

test('produces deterministic EditableList drag-handle hydration markup', () => {
	const first = render(EditableListDragHydrationProbe);

	expect(first).toEqual(render(EditableListDragHydrationProbe));
	expect(first.body).toBe(EDITABLE_LIST_DRAG_HYDRATION_SSR_BODY);
	expect(first.body).toContain('data-giu-drag-handle');
	expect(first.body).toContain('aria-label="Drag hero image"');
	expect(first.body).not.toContain('data-giu-dragging');
	expect(first.body).not.toContain('data-giu-drop-candidate');
	expect(first.body).not.toContain('draggable=');
	expect(first.body).not.toContain('aria-grabbed');
	expect(first.body).not.toContain('aria-dropeffect');
});
