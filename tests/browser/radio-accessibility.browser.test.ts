import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RadioProbe from '../fixtures/RadioProbe.svelte';

test('keeps native radio semantics and consumer-owned labels accessible', async () => {
	const screen = await render(RadioProbe);
	const root = screen.getByTestId('radio-probe').element() as HTMLElement;
	const enabled = screen.getByRole('radio', { name: 'Low importance' });
	const disabled = screen.getByRole('radio', { name: 'Disabled preference' });

	(enabled.element() as HTMLInputElement).focus();

	expect(enabled).toHaveFocus();
	expect(enabled).toHaveAttribute('type', 'radio');
	expect(enabled).not.toHaveAttribute('role');
	expect(disabled).toBeDisabled();
	expect(root.querySelector('[role="radio"], [role="radiogroup"]')).toBeNull();
	expect(root.querySelectorAll('input[type="radio"]')).toHaveLength(6);
	expect((await axe.run(root)).violations).toHaveLength(0);
});
