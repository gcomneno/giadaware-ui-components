import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import { SURFACE_HYDRATION_SSR_BODY } from '../fixtures/surface-hydration-contract.js';
import SurfaceHydrationProbe from '../fixtures/SurfaceHydrationProbe.svelte';

test('hydrates Surface without replacing neutral or consumer nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML = SURFACE_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="surface-hydration-probe"]',
	);
	const serverSurfaces = [
		...container.querySelectorAll<HTMLElement>('.giu-surface'),
	];
	const serverNav = container.querySelector('nav[aria-label="Resources"]');
	const serverAction = container.querySelector(
		'[data-testid="surface-hydration-action"]',
	);
	const serverLink = container.querySelector(
		'[data-testid="surface-hydration-link"]',
	);

	if (
		!(serverRoot instanceof HTMLElement) ||
		!(serverNav instanceof HTMLElement) ||
		!(serverAction instanceof HTMLButtonElement) ||
		!(serverLink instanceof HTMLAnchorElement)
	) {
		throw new TypeError('Server Surface hydration content missing');
	}

	expect(serverSurfaces).toHaveLength(2);

	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(SurfaceHydrationProbe, {
			target: container,
			recover: false,
		});

		await tick();

		expect(
			container.querySelector('[data-testid="surface-hydration-probe"]'),
		).toBe(serverRoot);
		expect([...container.querySelectorAll('.giu-surface')]).toEqual(
			serverSurfaces,
		);
		expect(container.querySelector('nav[aria-label="Resources"]')).toBe(
			serverNav,
		);
		expect(
			container.querySelector('[data-testid="surface-hydration-action"]'),
		).toBe(serverAction);
		expect(
			container.querySelector('[data-testid="surface-hydration-link"]'),
		).toBe(serverLink);

		for (const surface of serverSurfaces) {
			expect(surface.tagName).toBe('DIV');
			expect(surface).not.toHaveAttribute('role');
			expect(surface).not.toHaveAttribute('aria-label');
			expect(surface).not.toHaveAttribute('aria-labelledby');
		}

		serverAction.click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-action-count', '1'),
		);

		serverLink.click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-action-count', '2'),
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
