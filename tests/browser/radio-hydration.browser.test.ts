import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import RadioHydrationProbe from '../fixtures/RadioHydrationProbe.svelte';
import { RADIO_HYDRATION_SSR_BODY } from '../fixtures/radio-hydration-contract.js';

test('hydrates by reusing server radio nodes without activation or state mutation', async () => {
	const container = document.createElement('div');
	container.innerHTML = RADIO_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="radio-hydration-probe"]');
	const serverInputs = [...container.querySelectorAll('input[type="radio"]')];
	let component: Record<string, unknown> | undefined;

	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(RadioHydrationProbe, { target: container, recover: false });
		await tick();

		const hydratedRoot = container.querySelector('[data-testid="radio-hydration-probe"]');
		const hydratedInputs = [...container.querySelectorAll('input[type="radio"]')];

		expect(hydratedRoot).toBe(serverRoot);
		expect(hydratedInputs).toEqual(serverInputs);
		expect(serverRoot).toHaveAttribute('data-selected', 'primary');
		expect(serverRoot).toHaveAttribute('data-count', '0');
		expect(serverInputs[0]).toBeChecked();
		expect(serverInputs[1]).not.toBeChecked();
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		(serverInputs[1] as HTMLInputElement).click();

		await vi.waitFor(() => {
			expect(serverRoot).toHaveAttribute('data-selected', 'secondary');
			expect(serverRoot).toHaveAttribute('data-count', '1');
		});

		expect(serverInputs[0]).not.toBeChecked();
		expect(serverInputs[1]).toBeChecked();
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
