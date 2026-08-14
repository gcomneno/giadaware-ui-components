import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import IconButtonHydrationProbe from '../fixtures/IconButtonHydrationProbe.svelte';
import { ICON_BUTTON_HYDRATION_SSR_BODY } from '../fixtures/icon-button-hydration-contract.js';

test('hydrates without mismatch or activation and preserves native button nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML = ICON_BUTTON_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="icon-button-hydration-probe"]'
	);
	const serverButtons = [...container.querySelectorAll('button')];
	const serverIcons = [
		...container.querySelectorAll('.giu-icon-button__icon')
	];

	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(IconButtonHydrationProbe, {
			target: container,
			recover: false
		});
		await tick();

		expect(
			container.querySelector('[data-testid="icon-button-hydration-probe"]')
		).toBe(serverRoot);
		expect([...container.querySelectorAll('button')]).toEqual(serverButtons);
		expect([
			...container.querySelectorAll('.giu-icon-button__icon')
		]).toEqual(serverIcons);
		expect(serverRoot).toHaveAttribute('data-count', '0');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		serverButtons[0].click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-count', '1')
		);
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
