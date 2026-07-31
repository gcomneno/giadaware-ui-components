import axe from 'axe-core';
import { userEvent } from 'vitest/browser';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FormActionsProbe from '../fixtures/FormActionsProbe.svelte';

test('preserves natural semantics and DOM and tab order with zero Axe violations', async () => {
	const screen = await render(FormActionsProbe);
	const root = screen.getByTestId('form-actions-probe').element() as HTMLElement;
	const firstActions = root.querySelector('.giu-form-actions') as HTMLDivElement;
	const interactive = [...firstActions.querySelectorAll('button, a, input')];

	expect(firstActions.matches('[role], [aria-live], [aria-atomic], [aria-label]')).toBe(false);
	expect(interactive.map((element) => element.textContent?.trim() || element.getAttribute('name'))).toEqual([
		'Save',
		'Preview',
		'title',
		'Publish'
	]);

	(interactive[0] as HTMLElement).focus();
	expect(document.activeElement).toBe(interactive[0]);
	await userEvent.keyboard('{Tab}');
	expect(document.activeElement).toBe(interactive[1]);
	await userEvent.keyboard('{Tab}');
	expect(document.activeElement).toBe(interactive[2]);
	await userEvent.keyboard('{Tab}');
	expect(document.activeElement).toBe(interactive[3]);

	expect((await axe.run(root)).violations).toHaveLength(0);
});
