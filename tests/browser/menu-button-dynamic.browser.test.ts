import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import MenuButtonDynamicProbe from '../fixtures/MenuButtonDynamicProbe.svelte';

test('disabling an open menu closes it and prevents stale focus entry', async () => {
	const screen = await render(MenuButtonDynamicProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Dynamic actions' }
		).element() as HTMLButtonElement;
		const menu = document.getElementById(
			'dynamic-menu-menu'
		) as HTMLDivElement | null;
		const disable = screen.getByTestId(
			'dynamic-menu-disable'
		).element() as HTMLButtonElement;

		if (!menu) {
			throw new TypeError('Expected dynamic menu.');
		}

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(false)
		);

		disable.click();

		await vi.waitFor(() => {
			expect(trigger.disabled).toBe(true);
			expect(menu.hidden).toBe(true);
			expect(trigger).toHaveAttribute(
				'aria-expanded',
				'false'
			);
		});

		expect(
			document.activeElement
		).not.toBe(
			screen.getByTestId(
				'dynamic-menu-item'
			).element()
		);
	} finally {
		await screen.unmount();
	}
});
