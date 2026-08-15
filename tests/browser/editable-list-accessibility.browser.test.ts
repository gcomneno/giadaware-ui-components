import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import EditableListDragProbe from '../fixtures/EditableListDragProbe.svelte';
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

test('adds an exactly named native drag handle without deprecated drag-and-drop ARIA', async () => {
	const screen = await render(EditableListDragProbe);
	const root = screen.getByTestId('editable-list-drag-probe').element();
	const handle = screen.getByRole('button', { name: 'Drag hero image' });
	const disabledHandle = screen.getByRole('button', { name: 'Drag detail image' });
	const liveRegions = root.querySelectorAll('[aria-live], [role="status"], [role="alert"]');

	expect(handle.element()).toHaveAttribute('type', 'button');
	expect(handle.element()).toHaveAttribute('data-giu-drag-handle');
	expect(handle).toHaveAccessibleName('Drag hero image');
	expect(disabledHandle).toBeDisabled();
	expect(root.querySelector('[draggable="true"]')).toBeNull();
	expect(root.querySelector('[aria-grabbed]')).toBeNull();
	expect(root.querySelector('[aria-dropeffect]')).toBeNull();
	expect(root.querySelector('[data-giu-drag-handle] [aria-hidden="true"]')).toBeInstanceOf(HTMLElement);
	expect(liveRegions).toHaveLength(1);
	expect(liveRegions[0]).toHaveClass('giu-reorder-announcement');
	expect(root.querySelectorAll('.giu-reorder-actions__position-context[aria-live]')).toHaveLength(0);
	expect((await axe.run(root)).violations).toHaveLength(0);
});
