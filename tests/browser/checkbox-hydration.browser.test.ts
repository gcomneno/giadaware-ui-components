import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import CheckboxHydrationProbe from '../fixtures/CheckboxHydrationProbe.svelte';
import { CHECKBOX_HYDRATION_SSR_BODY } from '../fixtures/checkbox-hydration-contract.js';

test('hydrates by reusing the server input node without activation or state mutation', async () => {
	const container = document.createElement('div');
	container.innerHTML = CHECKBOX_HYDRATION_SSR_BODY;
	document.body.append(container);
	const serverRoot = container.querySelector('[data-testid="checkbox-hydration-probe"]');
	const serverInputs = [...container.querySelectorAll('input[type="checkbox"]')];
	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(CheckboxHydrationProbe, { target: container, recover: false });
		await tick();

		const hydratedRoot = container.querySelector('[data-testid="checkbox-hydration-probe"]');
		const hydratedInputs = [...container.querySelectorAll('input[type="checkbox"]')];

		expect(hydratedRoot).toBe(serverRoot);
		expect(hydratedInputs).toEqual(serverInputs);
		expect(serverRoot).toHaveAttribute('data-checked', 'true');
		expect(serverRoot).toHaveAttribute('data-count', '0');
		expect(serverInputs[0]).toBeChecked();
		expect(serverInputs[1]).not.toBeChecked();
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		(serverInputs[0] as HTMLInputElement).click();
		await vi.waitFor(() => {
			expect(serverRoot).toHaveAttribute('data-checked', 'false');
			expect(serverRoot).toHaveAttribute('data-count', '1');
		});
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
