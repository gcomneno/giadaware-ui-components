import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import { FIELD_DESCRIPTION_ERROR_HYDRATION_SSR_BODY } from '../fixtures/field-description-error-hydration-contract.js';
import FieldDescriptionErrorHydrationProbe from '../fixtures/FieldDescriptionErrorHydrationProbe.svelte';

test('hydrates field description and error regions without replacing nodes or inventing announcements', async () => {
	const container = document.createElement('div');
	container.innerHTML =
		FIELD_DESCRIPTION_ERROR_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="field-description-error-hydration-probe"]'
	);
	const serverEmail = container.querySelector('#hydration-email');
	const serverDescription = container.querySelector(
		'#hydration-email-description'
	);
	const serverCode = container.querySelector('#hydration-code');
	const serverStaticError = container.querySelector(
		'#hydration-code-error'
	);
	const serverDynamicInput = container.querySelector(
		'#hydration-dynamic'
	);
	const serverButton = container.querySelector('button');

	if (
		!(serverRoot instanceof HTMLElement) ||
		!(serverEmail instanceof HTMLInputElement) ||
		!(serverDescription instanceof HTMLElement) ||
		!(serverCode instanceof HTMLInputElement) ||
		!(serverStaticError instanceof HTMLElement) ||
		!(serverDynamicInput instanceof HTMLInputElement) ||
		!(serverButton instanceof HTMLButtonElement)
	) {
		throw new TypeError(
			'Server FieldDescription/FieldError hydration content missing'
		);
	}

	expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0);
	expect(
		container.querySelector('#hydration-dynamic-error')
	).toBeNull();

	let component: Record<string, unknown> | undefined;

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	try {
		component = hydrate(FieldDescriptionErrorHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="field-description-error-hydration-probe"]'
			)
		).toBe(serverRoot);
		expect(
			container.querySelector('#hydration-email')
		).toBe(serverEmail);
		expect(
			container.querySelector('#hydration-email-description')
		).toBe(serverDescription);
		expect(
			container.querySelector('#hydration-code')
		).toBe(serverCode);
		expect(
			container.querySelector('#hydration-code-error')
		).toBe(serverStaticError);
		expect(
			container.querySelector('#hydration-dynamic')
		).toBe(serverDynamicInput);
		expect(container.querySelector('button')).toBe(serverButton);

		expect(serverStaticError).not.toHaveAttribute('role');
		expect(serverStaticError).not.toHaveAttribute('aria-live');
		expect(serverStaticError).not.toHaveAttribute(
			'aria-atomic'
		);
		expect(
			container.querySelectorAll('[role="alert"]')
		).toHaveLength(0);

		serverEmail.value = 'giancarlo@example.test';
		serverEmail.dispatchEvent(
			new InputEvent('input', {
				bubbles: true,
				inputType: 'insertText',
				data: 'g'
			})
		);

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute(
				'data-interaction-count',
				'1'
			)
		);

		serverButton.click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute(
				'data-interaction-count',
				'11'
			)
		);

		const dynamicError = container.querySelector(
			'#hydration-dynamic-error'
		);

		expect(serverDynamicInput).toHaveAttribute(
			'aria-invalid',
			'true'
		);
		expect(serverDynamicInput).toHaveAttribute(
			'aria-errormessage',
			'hydration-dynamic-error'
		);
		expect(dynamicError).toHaveTextContent(
			'This value is required.'
		);
		expect(dynamicError).toHaveAttribute('role', 'alert');
		expect(dynamicError).toHaveAttribute(
			'aria-live',
			'assertive'
		);
		expect(dynamicError).toHaveAttribute(
			'aria-atomic',
			'true'
		);
		expect(
			container.querySelectorAll('[role="alert"]')
		).toHaveLength(1);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) {
			await unmount(component);
		}

		warn.mockRestore();
		error.mockRestore();

		expect(container.childNodes).toHaveLength(0);
		container.remove();
	}
});
