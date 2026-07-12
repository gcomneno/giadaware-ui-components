import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import HydrationProbe from '../fixtures/HydrationProbe.svelte';
import { HYDRATION_PROBE_SSR_BODY } from '../fixtures/hydration-probe-contract.js';

test('hydrates the server DOM without mismatch and becomes interactive', async () => {
	const container = document.createElement('div');
	container.innerHTML = HYDRATION_PROBE_SSR_BODY;
	document.body.append(container);

	const serverButton = container.querySelector(
		'[data-testid="hydration-probe"]'
	);

	expect(serverButton).toBeInstanceOf(HTMLButtonElement);

	const warnings: unknown[][] = [];
	const errors: unknown[][] = [];

	const warnSpy = vi
		.spyOn(console, 'warn')
		.mockImplementation((...args: unknown[]) => {
			warnings.push(args);
		});

	const errorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation((...args: unknown[]) => {
			errors.push(args);
		});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(HydrationProbe, {
			target: container,
			recover: false
		});

		const hydratedButton = container.querySelector(
			'[data-testid="hydration-probe"]'
		);

		expect(hydratedButton).toBe(serverButton);
		expect(hydratedButton).toHaveTextContent('Count: 1');

		if (!(hydratedButton instanceof HTMLButtonElement)) {
			throw new TypeError('Hydrated button was not found.');
		}

		hydratedButton.click();
		await tick();

		expect(hydratedButton).toHaveTextContent('Count: 2');
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);
	} finally {
		if (component) {
			await unmount(component);
		}

		warnSpy.mockRestore();
		errorSpy.mockRestore();
		container.remove();
	}
});
