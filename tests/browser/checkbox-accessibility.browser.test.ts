import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CheckboxProbe from '../fixtures/CheckboxProbe.svelte';

test('keeps native checkbox semantics and consumer-owned labels accessible', async () => {
	const screen = await render(CheckboxProbe);
	const root = screen.getByTestId('checkbox-probe').element() as HTMLElement;
	const enabled = screen.getByRole('checkbox', { name: 'Accept terms' });
	const disabled = screen.getByRole('checkbox', { name: 'Disabled preference' });

	(enabled.element() as HTMLInputElement).focus();
	expect(enabled).toHaveFocus();
	expect(enabled).toHaveAttribute('type', 'checkbox');
	expect(enabled).not.toHaveAttribute('role');
	expect(disabled).toBeDisabled();
	expect(root.querySelector('[role="switch"], [role="checkbox"]')).toBeNull();
	expect(root.querySelectorAll('input[type="checkbox"]')).toHaveLength(7);
	expect((await axe.run(root)).violations).toHaveLength(0);
});
