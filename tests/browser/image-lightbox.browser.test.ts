import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Probe from '../fixtures/ImageLightboxProbe.svelte';
import {
	acquireImageLightboxScrollLock
} from '../../src/lib/visitor/image-lightbox.js';

test('opens modally, focuses close, restores focus and restores scrolling', async () => {
	const htmlOverflow = document.documentElement.style.overflow;
	const bodyOverflow = document.body.style.overflow;
	document.documentElement.style.overflow = 'clip';
	document.body.style.overflow = 'auto';

	try {
		const screen = await render(Probe);
		const trigger = screen.getByTestId('image-lightbox-trigger').element() as HTMLButtonElement;
		trigger.focus();
		await trigger.click();

		const dialog = screen.getByRole('dialog', { name: 'Image preview' }).element() as HTMLDialogElement;
		const close = screen.getByRole('button', { name: 'Close image' }).element() as HTMLButtonElement;

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		await vi.waitFor(() => expect(document.activeElement).toBe(close));
		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');

		await close.click();

		await vi.waitFor(() => expect(dialog.open).toBe(false));
		await vi.waitFor(() => expect(document.activeElement).toBe(trigger));
		expect(document.documentElement.style.overflow).toBe('clip');
		expect(document.body.style.overflow).toBe('auto');
	} finally {
		document.documentElement.style.overflow = htmlOverflow;
		document.body.style.overflow = bodyOverflow;
	}
});

test('keeps controlled state authoritative when an Escape close is rejected', async () => {
	const screen = await render(Probe);
	await screen.getByRole('button', { name: 'Reject next close request' }).click();
	await screen.getByRole('button', { name: 'Open sample image' }).click();

	const dialog = screen.getByRole('dialog', { name: 'Image preview' }).element() as HTMLDialogElement;
	const root = screen.getByTestId('image-lightbox-probe');

	await vi.waitFor(() => expect(dialog.open).toBe(true));
	await userEvent.keyboard('{Escape}');

	await vi.waitFor(() => expect(root).toHaveAttribute('data-requests', '1'));
	expect(dialog.open).toBe(true);
	expect(root).toHaveAttribute('data-open', 'true');

	await userEvent.keyboard('{Escape}');

	await vi.waitFor(() => expect(dialog.open).toBe(false));
	expect(root).toHaveAttribute('data-requests', '2');
	expect(root).toHaveAttribute('data-open', 'false');
});

test('closes from backdrop interaction and preserves an uncropped contained image', async () => {
	const screen = await render(Probe);
	await screen.getByRole('button', { name: 'Open sample image' }).click();

	const dialog = screen.getByRole('dialog', { name: 'Image preview' }).element() as HTMLDialogElement;
	const image = screen.getByRole('img', { name: 'Sample landscape' }).element() as HTMLImageElement;

	await vi.waitFor(() => expect(dialog.open).toBe(true));
	const stage = dialog.querySelector(
		'.giu-image-lightbox__stage'
	) as HTMLDivElement;

	await vi.waitFor(() => expect(image.naturalWidth).toBe(1200));

	expect(getComputedStyle(image).objectFit).toBe('contain');
	expect(dialog).toHaveTextContent('Consumer-owned caption');
	expect((await axe.run(dialog)).violations).toHaveLength(0);

	// Exercise a mobile-relevant narrow modal surface.
	dialog.style.width = '320px';
	dialog.style.height = '480px';

	await vi.waitFor(() => {
		const bounds = image.getBoundingClientRect();

		expect(bounds.width).toBeGreaterThan(0);
		expect(bounds.height).toBeGreaterThan(0);
		expect(bounds.width).toBeLessThanOrEqual(stage.clientWidth);
		expect(bounds.height).toBeLessThanOrEqual(stage.clientHeight);
		expect(bounds.width / bounds.height).toBeCloseTo(1.5, 2);
	});

	// Touching the image itself must not close the lightbox.
	image.dispatchEvent(new PointerEvent('click', {
		pointerType: 'touch',
		bubbles: true,
		cancelable: true
	}));
	expect(dialog.open).toBe(true);

	// Touching empty stage space is a backdrop interaction.
	stage.dispatchEvent(new PointerEvent('click', {
		pointerType: 'touch',
		bubbles: true,
		cancelable: true
	}));

	await vi.waitFor(() => expect(dialog.open).toBe(false));
});

test('reference-counts scroll locks and restores exact previous inline values', () => {
	const htmlOverflow = document.documentElement.style.overflow;
	const bodyOverflow = document.body.style.overflow;
	document.documentElement.style.overflow = 'clip';
	document.body.style.overflow = 'scroll';

	try {
		const releaseFirst = acquireImageLightboxScrollLock(document);
		const releaseSecond = acquireImageLightboxScrollLock(document);

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');

		releaseFirst();
		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');

		releaseSecond();
		expect(document.documentElement.style.overflow).toBe('clip');
		expect(document.body.style.overflow).toBe('scroll');

		releaseSecond();
		expect(document.documentElement.style.overflow).toBe('clip');
		expect(document.body.style.overflow).toBe('scroll');
	} finally {
		document.documentElement.style.overflow = htmlOverflow;
		document.body.style.overflow = bodyOverflow;
	}
});
