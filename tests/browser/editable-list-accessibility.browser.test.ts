import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import EditableListProbe from '../fixtures/EditableListProbe.svelte';

test('has fieldset, legend, ordered list and clearly named native controls without duplicate spoken positions', async () => {
	const screen = await render(EditableListProbe);
	const root = screen.getByTestId('editable-list-probe').element();
	expect(root.querySelector('fieldset > legend')?.textContent).toBe('Gallery images');
	expect(root.querySelectorAll('ol > li')).toHaveLength(2);
	expect(root.querySelectorAll('.giu-editable-list-row__position[aria-hidden="true"]')).toHaveLength(2);
	expect(screen.getByRole('button', { name: 'Move first image up' })).toBeDisabled();
	expect((await axe.run(root)).violations).toHaveLength(0);
});
