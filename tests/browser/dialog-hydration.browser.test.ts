import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	DIALOG_HYDRATION_SSR_BODY,
	DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY
} from '../fixtures/dialog-hydration-contract.js';
import DialogHydrationProbe from '../fixtures/DialogHydrationProbe.svelte';
import DialogInitiallyOpenHydrationProbe from '../fixtures/DialogInitiallyOpenHydrationProbe.svelte';

function openingDialogTag(body: string): string {
	const match = body.match(/<dialog\b[^>]*>/);

	if (!match) {
		throw new TypeError('Dialog hydration markup did not contain a native dialog.');
	}

	return match[0];
}

test('hydrates closed SSR markup without replacement and opens afterward', async () => {
	expect(openingDialogTag(DIALOG_HYDRATION_SSR_BODY)).not.toMatch(/\sopen(?:=|\s|>)/);

	const container = document.createElement('div');
	container.innerHTML = DIALOG_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="dialog-hydration-probe"]');
	const serverDialog = container.querySelector(
		'[data-testid="dialog-hydration-dialog"]'
	) as HTMLDialogElement;
	const serverFocus = container.querySelector(
		'[data-testid="dialog-hydration-focus"]'
	) as HTMLButtonElement;

	expect(serverRoot).not.toBeNull();
	expect(serverDialog.open).toBe(false);
	expect(serverDialog.hasAttribute('open')).toBe(false);
	expect(serverFocus).not.toBeNull();

	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(DialogHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(container.querySelector('[data-testid="dialog-hydration-probe"]')).toBe(serverRoot);
		expect(container.querySelector('[data-testid="dialog-hydration-dialog"]')).toBe(serverDialog);
		expect(container.querySelector('[data-testid="dialog-hydration-focus"]')).toBe(serverFocus);
		expect(serverDialog.open).toBe(false);
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		const trigger = container.querySelector(
			'[data-testid="dialog-hydration-trigger"]'
		) as HTMLButtonElement;
		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(serverDialog.open).toBe(true));
		await vi.waitFor(() => expect(document.activeElement).toBe(serverFocus));

		serverFocus.click();
		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-action-count', '1')
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});

test('hydrates controlled open SSR markup into a native modal without recovery', async () => {
	expect(openingDialogTag(DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY)).not.toMatch(/\sopen(?:=|\s|>)/);
	expect(DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY).toContain('data-open="true"');

	const container = document.createElement('div');
	container.innerHTML = DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="dialog-hydration-probe"]');
	const serverDialog = container.querySelector(
		'[data-testid="dialog-hydration-dialog"]'
	) as HTMLDialogElement;
	const serverFocus = container.querySelector(
		'[data-testid="dialog-hydration-focus"]'
	) as HTMLButtonElement;

	expect(serverRoot).not.toBeNull();
	expect(serverDialog.hasAttribute('open')).toBe(false);
	expect(serverFocus).not.toBeNull();

	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(DialogInitiallyOpenHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(container.querySelector('[data-testid="dialog-hydration-probe"]')).toBe(serverRoot);
		expect(container.querySelector('[data-testid="dialog-hydration-dialog"]')).toBe(serverDialog);
		expect(container.querySelector('[data-testid="dialog-hydration-focus"]')).toBe(serverFocus);

		await vi.waitFor(() => expect(serverDialog.open).toBe(true));
		await vi.waitFor(() => expect(document.activeElement).toBe(serverFocus));

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
