import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import ImageFocalPointControlHydrationProbe from '../fixtures/ImageFocalPointControlHydrationProbe.svelte';
import { IMAGE_FOCAL_POINT_CONTROL_HYDRATION_SSR_BODY } from '../fixtures/image-focal-point-control-hydration-contract.js';

test('hydrates without unsolicited value changes or DOM replacement', async () => {
	const container = document.createElement('div');
	const warnings: unknown[][] = [];
	const errors: unknown[][] = [];
	let component: Record<string, unknown> | undefined;
	let warnSpy: ReturnType<typeof vi.spyOn> | undefined;
	let errorSpy: ReturnType<typeof vi.spyOn> | undefined;

	try {
		container.innerHTML = IMAGE_FOCAL_POINT_CONTROL_HYDRATION_SSR_BODY;
		document.body.append(container);

		const serverProbe = container.querySelector('[data-testid="image-focal-point-control-hydration-probe"]');
		const serverControl = container.querySelector('[data-giu-focal-x]');
		const serverButton = container.querySelector('button');
		const serverImage = container.querySelector('img');
		const serverMarker = container.querySelector('.giu-image-focal-point-control__marker');

		if (
			!(serverProbe instanceof HTMLElement) ||
			!(serverControl instanceof HTMLElement) ||
			!(serverButton instanceof HTMLButtonElement) ||
			!(serverImage instanceof HTMLImageElement) ||
			!(serverMarker instanceof HTMLElement)
		) {
			throw new TypeError('The shared hydration body is incomplete.');
		}

		warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => warnings.push(args));
		errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args));

		component = hydrate(ImageFocalPointControlHydrationProbe, {
			target: container,
			recover: false
		});
		await tick();

		expect(container.querySelector('[data-testid="image-focal-point-control-hydration-probe"]')).toBe(serverProbe);
		expect(container.querySelector('[data-giu-focal-x]')).toBe(serverControl);
		expect(container.querySelector('button')).toBe(serverButton);
		expect(container.querySelector('img')).toBe(serverImage);
		expect(container.querySelector('.giu-image-focal-point-control__marker')).toBe(serverMarker);
		expect(serverProbe).toHaveAttribute('data-change-count', '0');
		expect(serverControl).toHaveAttribute('data-giu-focal-x', '0.2500');
		expect(serverControl).toHaveAttribute('data-giu-focal-y', '0.7500');
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);
	} finally {
		if (component) await unmount(component);
		warnSpy?.mockRestore();
		errorSpy?.mockRestore();
		container.remove();
	}
});
