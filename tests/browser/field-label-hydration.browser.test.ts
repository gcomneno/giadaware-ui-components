import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import { FIELD_LABEL_HYDRATION_SSR_BODY } from '../fixtures/field-label-hydration-contract.js';
import FieldLabelHydrationProbe from '../fixtures/FieldLabelHydrationProbe.svelte';

test('hydrates FieldLabel without replacing presentation or consumer nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML = FIELD_LABEL_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="field-label-hydration-probe"]',
	);
	const serverRows = [
		...container.querySelectorAll<HTMLElement>(
			'.giu-field-label-row',
		),
	];
	const serverInputs = [
		...container.querySelectorAll<HTMLInputElement>('input'),
	];
	const serverHint = container.querySelector(
		'#hydration-email-hint',
	);
	const serverRequiredMarkers = [
		...container.querySelectorAll<HTMLElement>(
			'.giu-field-label-marker--required',
		),
	];

	if (
		!(serverRoot instanceof HTMLElement) ||
		!(serverHint instanceof HTMLElement)
	) {
		throw new TypeError(
			'Server FieldLabel hydration content missing',
		);
	}

	expect(serverRows).toHaveLength(4);
	expect(serverInputs).toHaveLength(4);
	expect(serverRequiredMarkers).toHaveLength(2);

	let component: Record<string, unknown> | undefined;

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	try {
		component = hydrate(FieldLabelHydrationProbe, {
			target: container,
			recover: false,
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="field-label-hydration-probe"]',
			),
		).toBe(serverRoot);

		expect([
			...container.querySelectorAll('.giu-field-label-row'),
		]).toEqual(serverRows);

		expect([
			...container.querySelectorAll('input'),
		]).toEqual(serverInputs);

		expect(
			container.querySelector('#hydration-email-hint'),
		).toBe(serverHint);

		expect([
			...container.querySelectorAll(
				'.giu-field-label-marker--required',
			),
		]).toEqual(serverRequiredMarkers);

		serverInputs[0].value = 'giancarlo@example.test';
		serverInputs[0].dispatchEvent(
			new InputEvent('input', {
				bubbles: true,
				inputType: 'insertText',
				data: 'g',
			}),
		);

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute(
				'data-interaction-count',
				'1',
			),
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) {
			await unmount(component);
		}

		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
