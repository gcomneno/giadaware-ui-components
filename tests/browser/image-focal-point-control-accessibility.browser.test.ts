import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ImageFocalPointControlAccessibilityProbe from '../fixtures/ImageFocalPointControlAccessibilityProbe.svelte';

test('provides named native controls and has no Axe violations', async () => {
	await render(ImageFocalPointControlAccessibilityProbe);
	const root = document.querySelector('[data-testid="image-focal-point-control-accessibility-probe"]');

	if (!(root instanceof HTMLElement)) {
		throw new TypeError('The focal-point accessibility probe was not rendered.');
	}

	const controls = [...root.querySelectorAll<HTMLButtonElement>('button')];
	expect(controls).toHaveLength(3);
	expect(controls.map((control) => control.getAttribute('aria-label'))).toEqual([
		'Choose empty focal point',
		'Choose current focal point',
		'Choose disabled focal point'
	]);
	expect(controls.every((control) => control.type === 'button')).toBe(true);
	expect(controls[0]).toHaveAttribute('aria-keyshortcuts', 'ArrowUp ArrowRight ArrowDown ArrowLeft');
	expect(controls[2]).toBeDisabled();

	const images = [...root.querySelectorAll<HTMLImageElement>('img')];
	expect(images.map((image) => image.getAttribute('alt'))).toEqual([
		'Empty-state focal preview',
		'Current focal preview',
		'Disabled focal preview'
	]);

	const current = root.querySelector('[data-testid="current-focal"] [data-giu-focal-x]');
	if (!(current instanceof HTMLElement)) {
		throw new TypeError('The current focal-point control was not rendered.');
	}

	expect(current).toHaveAttribute('data-giu-focal-x', '0.2500');
	expect(current).toHaveAttribute('data-giu-focal-y', '0.7500');

	controls[0].dispatchEvent(new KeyboardEvent('keydown', {
		key: 'ArrowRight',
		bubbles: true,
		cancelable: true
	}));
	await vi.waitFor(() => expect(root).toHaveAttribute('data-empty-count', '1'));

	const results = await axe.run(root);
	if (results.violations.length > 0) {
		throw new Error(`Accessibility violations found:\n${JSON.stringify(results.violations.map((violation) => ({ id: violation.id, impact: violation.impact, description: violation.description, nodes: violation.nodes.map((node) => node.target) })), null, 2)}`);
	}
	expect(results.violations).toHaveLength(0);
});
