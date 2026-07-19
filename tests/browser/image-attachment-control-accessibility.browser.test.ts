import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ImageAttachmentControlAccessibilityProbe from '../fixtures/ImageAttachmentControlAccessibilityProbe.svelte';

test('provides deterministic image attachment semantics and has no Axe violations', async () => {
	await render(ImageAttachmentControlAccessibilityProbe);
	const root = document.querySelector('[data-testid="image-attachment-control-accessibility-probe"]');
	if (!(root instanceof HTMLElement)) throw new TypeError('The accessibility probe was not rendered.');
	const inputs = [...root.querySelectorAll<HTMLInputElement>('input[type="file"]')];
	expect(inputs).toHaveLength(5);
	expect(inputs.every((input) => input.offsetParent !== null)).toBe(true);
	const expectedLabels = ['Choose an empty-state image', 'Choose a current-image replacement', 'Choose another replacement image', 'Choose an image after removal', 'Choose a disabled image'];
	expect(inputs.map((input) => input.labels?.[0]?.textContent)).toEqual(expectedLabels);
	const expectedStates = [
		{ id: 'accessibility-empty-image', intent: 'keep', status: 'No image selected' },
		{ id: 'accessibility-current-image', intent: 'keep', status: 'Current image is kept', imageAlt: 'Preview of the current image' },
		{ id: 'accessibility-replacement-image', intent: 'replace', status: 'Replacement image selected', imageAlt: 'Preview of the replacement image' },
		{ id: 'accessibility-removed-image', intent: 'remove', status: 'Current image marked for removal', imageAlt: 'Preview of the current image' },
		{ id: 'accessibility-disabled-image', intent: 'keep', status: 'Current image is kept', imageAlt: 'Preview of the current image' }
	] as const;
	const controls = new Map<string, HTMLElement>();
	for (const expected of expectedStates) {
		const input = root.querySelector(`#${expected.id}`);
		if (!(input instanceof HTMLInputElement)) throw new TypeError(`The ${expected.id} input was not rendered.`);
		const control = input.closest('[data-intent]');
		if (!(control instanceof HTMLElement)) throw new TypeError(`The ${expected.id} control was not rendered.`);
		controls.set(expected.id, control);
		expect(control).toHaveAttribute('data-intent', expected.intent);
		const status = control.querySelector('[role="status"]');
		expect(status).toHaveAttribute('role', 'status');
		expect(status).toHaveAttribute('aria-live', 'polite');
		expect(status).toHaveAttribute('aria-atomic', 'true');
		expect(status?.textContent).toBe(expected.status);
		if ('imageAlt' in expected) {
			const image = control.querySelector('img');
			expect(image).toHaveAttribute('alt', expected.imageAlt);
		}
	}
	expect([...root.querySelectorAll('button')].every((button) => button.type === 'button')).toBe(true);
	const disabledControl = controls.get('accessibility-disabled-image');
	expect(disabledControl?.querySelectorAll(':is(input, button):not(:disabled)')).toHaveLength(0);
	const emptyControl = controls.get('accessibility-empty-image');
	expect(emptyControl?.querySelectorAll('button')).toHaveLength(0);

	const emptyInput = root.querySelector('#accessibility-empty-image');
	if (!(emptyInput instanceof HTMLInputElement)) throw new TypeError('The PNG input was not rendered.');
	const transfer = new DataTransfer();
	transfer.items.add(new File(['not an image'], 'invalid.txt', { type: 'text/plain' }));
	Object.defineProperty(emptyInput, 'files', { configurable: true, value: transfer.files });
	emptyInput.dispatchEvent(new Event('change', { bubbles: true }));
	await vi.waitFor(() => expect(emptyInput).toHaveAttribute('aria-invalid', 'true'));
	expect(emptyControl).toHaveAttribute('data-intent', 'keep');
	expect(emptyInput.value).toBe('');
	expect(document.activeElement).toBe(emptyInput);
	const errorId = emptyInput.getAttribute('aria-describedby');
	expect(errorId).toBe('accessibility-empty-image-error');
	const error = root.querySelector(`#${errorId}`);
	expect(error).toHaveAttribute('role', 'alert');
	expect(error).toHaveAttribute('aria-live', 'assertive');
	expect(error).toHaveAttribute('aria-atomic', 'true');
	expect(error).toHaveTextContent('Select a PNG image');

	const results = await axe.run(root);
	if (results.violations.length > 0) {
		throw new Error(`Accessibility violations found:\n${JSON.stringify(results.violations.map((violation) => ({ id: violation.id, impact: violation.impact, description: violation.description, nodes: violation.nodes.map((node) => node.target) })), null, 2)}`);
	}
	expect(results.violations).toHaveLength(0);
});
