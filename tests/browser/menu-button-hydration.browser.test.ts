import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import {
	MENU_BUTTON_HYDRATION_SSR_BODY
} from '../fixtures/menu-button-hydration-contract.js';
import MenuButtonHydrationProbe from '../fixtures/MenuButtonHydrationProbe.svelte';

test('hydrates MenuButton without replacing nodes or mutating initial state', async () => {
	const container = document.createElement('div');
	container.innerHTML =
		MENU_BUTTON_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverProbe = container.querySelector(
		'[data-testid="menu-button-hydration-probe"]'
	) as HTMLDivElement | null;
	const serverTrigger = container.querySelector(
		'button[aria-haspopup="menu"]'
	) as HTMLButtonElement | null;
	const serverMenu = container.querySelector(
		'[role="menu"]'
	) as HTMLDivElement | null;
	const serverItem = container.querySelector(
		'[data-testid="menu-button-hydration-item"]'
	) as HTMLButtonElement | null;

	expect(serverProbe).not.toBeNull();
	expect(serverTrigger).not.toBeNull();
	expect(serverMenu).not.toBeNull();
	expect(serverItem).not.toBeNull();

	if (
		!serverProbe ||
		!serverTrigger ||
		!serverMenu ||
		!serverItem
	) {
		throw new TypeError(
			'Expected server MenuButton nodes.'
		);
	}

	const triggerId = serverTrigger.id;
	const menuId = serverMenu.id;

	expect(serverMenu.hidden).toBe(true);
	expect(serverProbe).toHaveAttribute(
		'data-action-count',
		'0'
	);

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(MenuButtonHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="menu-button-hydration-probe"]'
			)
		).toBe(serverProbe);
		expect(
			container.querySelector(
				'button[aria-haspopup="menu"]'
			)
		).toBe(serverTrigger);
		expect(
			container.querySelector(
				'[role="menu"]'
			)
		).toBe(serverMenu);
		expect(
			container.querySelector(
				'[data-testid="menu-button-hydration-item"]'
			)
		).toBe(serverItem);

		expect(serverTrigger.id).toBe(triggerId);
		expect(serverMenu.id).toBe(menuId);
		expect(serverMenu.hidden).toBe(true);
		expect(serverTrigger).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		expect(serverProbe).toHaveAttribute(
			'data-action-count',
			'0'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		serverTrigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(serverMenu.hidden).toBe(false)
		);
		await vi.waitFor(() =>
			expect(document.activeElement).toBe(
				serverItem
			)
		);

		serverItem.click();

		await vi.waitFor(() =>
			expect(serverMenu.hidden).toBe(true)
		);
		await vi.waitFor(() =>
			expect(serverProbe).toHaveAttribute(
				'data-action-count',
				'1'
			)
		);
		await vi.waitFor(() =>
			expect(document.activeElement).toBe(
				serverTrigger
			)
		);

		expect(serverTrigger.id).toBe(triggerId);
		expect(serverMenu.id).toBe(menuId);
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
