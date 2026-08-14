import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ButtonProbe from '../fixtures/ButtonProbe.svelte';

test('uses native accessible names, focus and disabled semantics without live regions or tooltips', async () => {
	const screen = await render(ButtonProbe);
	const root = screen.getByTestId('button-probe').element() as HTMLElement;
	const enabled = screen.getByRole('button', { name: 'Save changes' });
	const disabled = screen.getByRole('button', { name: 'Disabled action' });
	(enabled.element() as HTMLButtonElement).focus();
	expect(enabled).toHaveFocus();
	expect(disabled).toBeDisabled();
	expect(enabled).not.toHaveAttribute('aria-busy');
	expect(root.querySelectorAll('.giu-button__leading[aria-hidden="true"]')).not.toHaveLength(0);
	expect(root.querySelectorAll('.giu-button__trailing[aria-hidden="true"]')).not.toHaveLength(0);
	expect(root.querySelector('[role="status"], [role="alert"], [aria-live], [role="tooltip"]')).toBeNull();
	expect((await axe.run(root)).violations).toHaveLength(0);
});
