import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import EditableListProbe from '../fixtures/EditableListProbe.svelte';
import ReorderActionsPositionContextProbe from '../fixtures/ReorderActionsPositionContextProbe.svelte';

test('has fieldset, legend, ordered list and clearly named native controls without duplicate spoken positions', async () => {
	const screen = await render(EditableListProbe);
	const root = screen.getByTestId('editable-list-probe').element();
	expect(root.querySelector('fieldset > legend')?.textContent).toBe('Gallery images');
	expect(root.querySelectorAll('ol > li')).toHaveLength(2);
	expect(root.querySelectorAll('.giu-editable-list-row__position[aria-hidden="true"]')).toHaveLength(2);
	expect(screen.getByRole('button', { name: 'Move first image up' })).toBeDisabled();
	expect((await axe.run(root)).violations).toHaveLength(0);
});

test('keeps position context visually hidden, accessible, non-live and referenced', async () => {
	const screen = await render(ReorderActionsPositionContextProbe);
	const root = screen.getByTestId('reorder-actions-position-context-probe').element();
	const descriptions = root.querySelectorAll('.giu-reorder-actions__position-context');
	const describedButtons = root.querySelectorAll('button[aria-describedby]');

	expect(descriptions).toHaveLength(2);
	expect(describedButtons).toHaveLength(4);

	for (const description of descriptions) {
		expect(description).toBeInstanceOf(HTMLElement);
		expect(description).not.toHaveAttribute('aria-hidden');
		expect(description).not.toHaveAttribute('aria-live');
		expect(description).not.toHaveAttribute('role');

		const styles = getComputedStyle(description as HTMLElement);
		expect(styles.position).toBe('absolute');
		expect(styles.overflow).toBe('hidden');
		expect(styles.clipPath).toBe('inset(50%)');
	}

	for (const button of describedButtons) {
		const descriptionId = button.getAttribute('aria-describedby');
		expect(descriptionId).toBeTruthy();
		expect(root.querySelector(`#${descriptionId}`)).toBeInstanceOf(HTMLElement);
	}

	expect((await axe.run(root)).violations).toHaveLength(0);
});
