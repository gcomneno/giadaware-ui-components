import { hydrate, tick, unmount } from 'svelte';
import { afterEach, expect, test, vi } from 'vitest';

import FormStatus from '../../src/lib/FormStatus.svelte';
import {
	FORM_STATUS_HYDRATION_PROPS,
	FORM_STATUS_SSR_BODY
} from '../fixtures/form-status-hydration-contract.js';

afterEach(() => {
	vi.useRealTimers();
});

test('hydrates FormStatus without mismatch, reuses its DOM and starts the browser timer', async () => {
	vi.useFakeTimers();

	const container = document.createElement('div');
	container.innerHTML = FORM_STATUS_SSR_BODY;
	document.body.append(container);

	const serverStatus = container.querySelector('p');
	const warnings: unknown[][] = [];
	const errors: unknown[][] = [];
	const warnSpy = vi
		.spyOn(console, 'warn')
		.mockImplementation((...args: unknown[]) => warnings.push(args));
	const errorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation((...args: unknown[]) => errors.push(args));
	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(FormStatus, {
			target: container,
			props: FORM_STATUS_HYDRATION_PROPS,
			recover: false
		});
		await tick();

		const hydratedStatus = container.querySelector('p');

		expect(hydratedStatus).toBe(serverStatus);
		expect(hydratedStatus).toHaveTextContent(
			'Controlla i campi evidenziati'
		);
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		await vi.advanceTimersByTimeAsync(4_999);
		expect(container.querySelector('p')).toBe(hydratedStatus);

		await vi.advanceTimersByTimeAsync(1);
		expect(container.querySelector('p')).toBeNull();
	} finally {
		if (component) {
			await unmount(component);
		}

		warnSpy.mockRestore();
		errorSpy.mockRestore();
		container.remove();
	}
});
