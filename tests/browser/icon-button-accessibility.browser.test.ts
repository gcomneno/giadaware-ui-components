import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import IconButtonProbe from '../fixtures/IconButtonProbe.svelte';

test('uses the required consumer label as the only button name and keeps icon geometry decorative', async () => {
	const screen = await render(IconButtonProbe);
	const root = screen.getByTestId('icon-button-probe').element() as HTMLElement;
	const edit = screen.getByRole('button', { name: 'Edit item' });
	const disabled = screen.getByRole('button', { name: 'Unavailable action' });

	(edit.element() as HTMLButtonElement).focus();
	expect(edit).toHaveFocus();
	expect(disabled).toBeDisabled();
	expect(root.querySelector('button[aria-label="Ignored edit geometry"]')).toBeNull();

	for (const icon of root.querySelectorAll('.giu-icon-button__icon')) {
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	}

	expect(root.querySelector('[role="tooltip"], [role="status"], [role="alert"], [aria-live]')).toBeNull();
	expect((await axe.run(root)).violations).toHaveLength(0);
});
