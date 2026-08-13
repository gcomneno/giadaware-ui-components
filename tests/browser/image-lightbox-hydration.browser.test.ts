import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import ImageLightboxHydrationProbe from '../fixtures/ImageLightboxHydrationProbe.svelte';
import {
	IMAGE_LIGHTBOX_HYDRATION_SSR_BODY
} from '../fixtures/image-lightbox-hydration-contract.js';

test('hydrates deterministic dialog markup and becomes interactive without replacement', async () => {
	const container = document.createElement('div');
	container.innerHTML = IMAGE_LIGHTBOX_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="image-lightbox-hydration"]'
	);
	const serverDialog = container.querySelector(
		'[data-giu-image-lightbox]'
	) as HTMLDialogElement;
	const serverAction = [...container.querySelectorAll('button')].find(
		(button) => button.textContent === 'Hydration action'
	) as HTMLButtonElement;

	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(ImageLightboxHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector('[data-testid="image-lightbox-hydration"]')
		).toBe(serverRoot);
		expect(container.querySelector('[data-giu-image-lightbox]')).toBe(serverDialog);
		expect(
			[...container.querySelectorAll('button')].find(
				(button) => button.textContent === 'Hydration action'
			)
		).toBe(serverAction);
		expect(serverDialog.contains(serverAction)).toBe(true);
		expect(serverAction.closest('figcaption')).toBeNull();
		expect(serverAction.closest('.giu-image-lightbox__actions')).not.toBeNull();
		expect(serverDialog.open).toBe(false);
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		const trigger = container.querySelector(
			'button'
		) as HTMLButtonElement;
		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(serverDialog.open).toBe(true));

		const close = container.querySelector(
			'.giu-image-lightbox__close'
		) as HTMLButtonElement;

		await vi.waitFor(() => expect(document.activeElement).toBe(close));

		serverAction.click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-action-count', '1')
		);
		expect(serverDialog.open).toBe(true);

		await userEvent.keyboard('{Escape}');

		await vi.waitFor(() => expect(serverDialog.open).toBe(false));
		await vi.waitFor(() => expect(document.activeElement).toBe(trigger));

		expect(serverRoot).toHaveAttribute('data-open', 'false');
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});

test('hydrates controlled open=true SSR markup into a native modal without recovery', async () => {
	const { default: InitiallyOpenProbe } = await import(
		'../fixtures/ImageLightboxInitiallyOpenHydrationProbe.svelte'
	);
	const container = document.createElement('div');
	container.innerHTML = IMAGE_LIGHTBOX_HYDRATION_SSR_BODY.replace(
		'data-open="false"',
		'data-open="true"'
	);
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="image-lightbox-hydration"]'
	);
	const serverDialog = container.querySelector(
		'[data-giu-image-lightbox]'
	) as HTMLDialogElement;

	const previousHtmlOverflow = document.documentElement.style.overflow;
	const previousBodyOverflow = document.body.style.overflow;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(InitiallyOpenProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector('[data-testid="image-lightbox-hydration"]')
		).toBe(serverRoot);
		expect(container.querySelector('[data-giu-image-lightbox]')).toBe(serverDialog);

		await vi.waitFor(() => expect(serverDialog.open).toBe(true));

		const close = container.querySelector(
			'.giu-image-lightbox__close'
		) as HTMLButtonElement;

		await vi.waitFor(() => expect(document.activeElement).toBe(close));

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		await userEvent.keyboard('{Escape}');

		await vi.waitFor(() => expect(serverDialog.open).toBe(false));
		expect(serverRoot).toHaveAttribute('data-open', 'false');
		expect(document.documentElement.style.overflow).toBe(previousHtmlOverflow);
		expect(document.body.style.overflow).toBe(previousBodyOverflow);
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
		document.documentElement.style.overflow = previousHtmlOverflow;
		document.body.style.overflow = previousBodyOverflow;
	}
});
