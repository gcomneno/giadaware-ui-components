import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import ImageAttachmentControlHydrationProbe from '../fixtures/ImageAttachmentControlHydrationProbe.svelte';
import { IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS, IMAGE_ATTACHMENT_CONTROL_HYDRATION_SSR_BODY } from '../fixtures/image-attachment-control-hydration-contract.js';

test('hydrates the controlled image attachment DOM without recovery and preserves focus transitions', async () => {
	const container = document.createElement('div');
	const warnings: unknown[][] = [];
	const errors: unknown[][] = [];
	let component: Record<string, unknown> | undefined;
	let warnSpy: ReturnType<typeof vi.spyOn> | undefined;
	let errorSpy: ReturnType<typeof vi.spyOn> | undefined;
	try {
		container.innerHTML = IMAGE_ATTACHMENT_CONTROL_HYDRATION_SSR_BODY;
		document.body.append(container);
		const serverProbe = container.querySelector('[data-testid="image-attachment-control-hydration-probe"]');
		const serverControl = container.querySelector('[data-intent]');
		const serverInput = container.querySelector('input[type="file"]');
		const serverImage = container.querySelector('img');
		const serverRemove = [...container.querySelectorAll('button')].find((button) => button.textContent === IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS.remove);
		if (!(serverProbe instanceof HTMLElement) || !(serverControl instanceof HTMLElement) || !(serverInput instanceof HTMLInputElement) || !(serverImage instanceof HTMLImageElement) || !(serverRemove instanceof HTMLButtonElement)) throw new TypeError('The shared hydration body is incomplete.');
		warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => warnings.push(args));
		errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args));
		component = hydrate(ImageAttachmentControlHydrationProbe, { target: container, recover: false });
		await tick();
		expect(container.querySelector('[data-testid="image-attachment-control-hydration-probe"]')).toBe(serverProbe);
		expect(container.querySelector('[data-intent]')).toBe(serverControl);
		expect(container.querySelector('input[type="file"]')).toBe(serverInput);
		expect(container.querySelector('img')).toBe(serverImage);
		expect([...container.querySelectorAll('button')].find((button) => button.textContent === IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS.remove)).toBe(serverRemove);
		expect(serverControl).toHaveAttribute('data-intent', 'keep');
		expect(serverProbe).toHaveAttribute('data-change-count', '0');
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		serverRemove.click();
		await vi.waitFor(() => expect(serverControl).toHaveAttribute('data-intent', 'remove'));
		expect(container.querySelector('[data-testid="image-attachment-control-hydration-probe"]')).toBe(serverProbe);
		expect(container.querySelector('input[type="file"]')).toBe(serverInput);
		expect(container.querySelector('img')).toBe(serverImage);
		const cancel = [...container.querySelectorAll('button')].find((button) => button.textContent === IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS.cancelRemoval);
		expect(cancel).toBeInstanceOf(HTMLButtonElement);
		await vi.waitFor(() => expect(document.activeElement).toBe(cancel));
		(cancel as HTMLButtonElement).click();
		await vi.waitFor(() => expect(serverControl).toHaveAttribute('data-intent', 'keep'));
		await vi.waitFor(() => expect(document.activeElement).toBe(serverInput));
		expect(container.querySelector('[data-testid="image-attachment-control-hydration-probe"]')).toBe(serverProbe);
		expect(container.querySelector('[data-intent]')).toBe(serverControl);
		expect(container.querySelector('input[type="file"]')).toBe(serverInput);
		expect(container.querySelector('img')).toBe(serverImage);
		expect(serverProbe).toHaveAttribute('data-change-count', '2');
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);
	} finally {
		try {
			if (component) await unmount(component);
		} finally {
			warnSpy?.mockRestore();
			errorSpy?.mockRestore();
			container.remove();
		}
	}
});
