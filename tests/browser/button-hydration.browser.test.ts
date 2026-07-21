import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import ButtonHydrationProbe from '../fixtures/ButtonHydrationProbe.svelte';
import { BUTTON_HYDRATION_SSR_BODY } from '../fixtures/button-hydration-contract.js';

test('hydrates without mismatch or activation and remains interactive afterward', async () => {
	const container = document.createElement('div');
	container.innerHTML = BUTTON_HYDRATION_SSR_BODY;
	document.body.append(container);
	const serverRoot = container.querySelector('[data-testid="button-hydration-probe"]');
	const serverButtons = [...container.querySelectorAll('button')];
	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	try {
		component = hydrate(ButtonHydrationProbe, { target: container, recover: false });
		await tick();
		expect(container.querySelector('[data-testid="button-hydration-probe"]')).toBe(serverRoot);
		expect([...container.querySelectorAll('button')]).toEqual(serverButtons);
		expect(serverRoot).toHaveAttribute('data-count', '0');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
		serverButtons[0].click();
		await vi.waitFor(() => expect(serverRoot).toHaveAttribute('data-count', '1'));
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
