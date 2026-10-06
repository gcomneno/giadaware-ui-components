import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import MenuButtonProbe from '../fixtures/MenuButtonProbe.svelte';

function resolveMenu(
	trigger: HTMLButtonElement
): HTMLDivElement {
	const id = trigger.getAttribute('aria-controls');

	if (!id) {
		throw new TypeError(
			'Menu trigger is missing aria-controls.'
		);
	}

	const menu = document.getElementById(id);

	if (!(menu instanceof HTMLDivElement)) {
		throw new TypeError(
			'Expected controlled menu element.'
		);
	}

	return menu;
}

test('click toggles menu state without moving focus into the menu', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		expect(menu.hidden).toBe(true);
		expect(trigger).toHaveAttribute(
			'aria-expanded',
			'false'
		);

		trigger.focus();
		await screen.getByRole(
			'button',
			{ name: 'Actions' }
		).click();

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(false)
		);

		expect(trigger).toHaveAttribute(
			'aria-expanded',
			'true'
		);
		expect(document.activeElement).toBe(trigger);

		await screen.getByRole(
			'button',
			{ name: 'Actions' }
		).click();

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(true)
		);

		expect(trigger).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	} finally {
		await screen.unmount();
	}
});

test('ArrowDown opens and focuses first enabled item', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const edit = screen.getByTestId(
			'menu-item-edit'
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(false)
		);
		await vi.waitFor(() =>
			expect(document.activeElement).toBe(edit)
		);
	} finally {
		await screen.unmount();
	}
});

test('ArrowUp opens and focuses last enabled item', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const last = screen.getByTestId(
			'menu-item-delete'
		).element() as HTMLButtonElement;

		trigger.focus();
		await userEvent.keyboard('{ArrowUp}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(last)
		);
	} finally {
		await screen.unmount();
	}
});

test('menu navigation skips disabled items and wraps', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const edit = screen.getByTestId(
			'menu-item-edit'
		).element() as HTMLButtonElement;
		const disabled = screen.getByTestId(
			'menu-item-disabled'
		).element() as HTMLButtonElement;
		const last = screen.getByTestId(
			'menu-item-delete'
		).element() as HTMLButtonElement;

		expect(disabled.disabled).toBe(true);

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(edit)
		);

		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(last)
		);

		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(edit)
		);

		await userEvent.keyboard('{ArrowUp}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(last)
		);
	} finally {
		await screen.unmount();
	}
});

test('Home and End move to first and last enabled item', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const edit = screen.getByTestId(
			'menu-item-edit'
		).element() as HTMLButtonElement;
		const last = screen.getByTestId(
			'menu-item-delete'
		).element() as HTMLButtonElement;

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await userEvent.keyboard('{End}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(last)
		);

		await userEvent.keyboard('{Home}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(edit)
		);
	} finally {
		await screen.unmount();
	}
});

test('Escape closes menu and restores focus to trigger', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(false)
		);

		await userEvent.keyboard('{Escape}');

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(true)
		);
		await vi.waitFor(() =>
			expect(document.activeElement).toBe(trigger)
		);

		expect(trigger).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	} finally {
		await screen.unmount();
	}
});

test('Tab closes without trapping focus or restoring it to trigger', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const outside = screen.getByTestId(
			'outside-button'
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(false)
		);

		await userEvent.keyboard('{Tab}');

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(true)
		);

		expect(document.activeElement).toBe(outside);
	} finally {
		await screen.unmount();
	}
});

test('item click composes consumer callback once, closes and restores trigger focus', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const probe = screen.getByTestId(
			'menu-button-probe'
		);
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const edit = screen.getByTestId(
			'menu-item-edit'
		);
		const menu = resolveMenu(trigger);

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await edit.click();

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(true)
		);
		await vi.waitFor(() =>
			expect(document.activeElement).toBe(trigger)
		);

		expect(probe).toHaveAttribute(
			'data-edit-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('consumer item keydown callback composes once with package navigation', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const probe = screen.getByTestId(
			'menu-button-probe'
		);
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const last = screen.getByTestId(
			'menu-item-delete'
		).element() as HTMLButtonElement;

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(last)
		);

		expect(probe).toHaveAttribute(
			'data-item-keydown-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('outside pointerdown closes without stealing outside focus', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const outside = screen.getByTestId(
			'outside-button'
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		outside.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				cancelable: true
			})
		);
		outside.focus();

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(true)
		);

		expect(document.activeElement).toBe(outside);
	} finally {
		await screen.unmount();
	}
});

test('disabled trigger cannot open the menu', async () => {
	const screen = await render(MenuButtonProbe, {
		disabled: true
	});

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		expect(trigger.disabled).toBe(true);
		expect(menu.hidden).toBe(true);

		trigger.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				bubbles: true,
				cancelable: true
			})
		);

		expect(menu.hidden).toBe(true);
		expect(trigger).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	} finally {
		await screen.unmount();
	}
});

test('multiple instances keep ids and keyboard ownership isolated', async () => {
	const first = await render(MenuButtonProbe, {
		id: 'first-menu'
	});
	const second = await render(MenuButtonProbe, {
		id: 'second-menu'
	});

	try {
		const firstTrigger = document.getElementById(
			'first-menu-trigger'
		) as HTMLButtonElement | null;
		const secondTrigger = document.getElementById(
			'second-menu-trigger'
		) as HTMLButtonElement | null;

		const firstMenu = document.getElementById(
			'first-menu-menu'
		) as HTMLDivElement | null;
		const secondMenu = document.getElementById(
			'second-menu-menu'
		) as HTMLDivElement | null;

		expect(firstTrigger).not.toBeNull();
		expect(secondTrigger).not.toBeNull();
		expect(firstMenu).not.toBeNull();
		expect(secondMenu).not.toBeNull();

		if (
			!firstTrigger ||
			!secondTrigger ||
			!firstMenu ||
			!secondMenu
		) {
			throw new TypeError(
				'Expected both menu instances.'
			);
		}

		firstTrigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(firstMenu.hidden).toBe(false)
		);

		expect(secondMenu.hidden).toBe(true);
		expect(secondTrigger).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	} finally {
		await first.unmount();
		await second.unmount();
	}
});

test('renders an accessible menu button pattern with no axe violations', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const probe = screen.getByTestId(
			'menu-button-probe'
		).element();

		expect(
			(await axe.run(probe)).violations
		).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});

test.each([
	['Enter', '{Enter}'],
	['Space', ' ']
] as const)(
	'%s opens the menu and focuses the first enabled item',
	async (_name, key) => {
		const screen = await render(MenuButtonProbe);

		try {
			const trigger = screen.getByRole(
				'button',
				{ name: 'Actions' }
			).element() as HTMLButtonElement;
			const first = screen.getByTestId(
				'menu-item-edit'
			).element() as HTMLButtonElement;
			const menu = resolveMenu(trigger);

			trigger.focus();
			await userEvent.keyboard(key);

			await vi.waitFor(() =>
				expect(menu.hidden).toBe(false)
			);

			await vi.waitFor(() =>
				expect(document.activeElement).toBe(first)
			);
		} finally {
			await screen.unmount();
		}
	}
);

test('Tab from a pointer-opened trigger closes without trapping focus', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const menu = resolveMenu(trigger);

		trigger.focus();
		await screen.getByRole(
			'button',
			{ name: 'Actions' }
		).click();

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(false)
		);

		await userEvent.tab();

		await vi.waitFor(() =>
			expect(menu.hidden).toBe(true)
		);
	} finally {
		await screen.unmount();
	}
});

test('open menu remains axe-clean', async () => {
	const screen = await render(MenuButtonProbe);

	try {
		const trigger = screen.getByRole(
			'button',
			{ name: 'Actions' }
		).element() as HTMLButtonElement;
		const probe = screen.getByTestId(
			'menu-button-probe'
		).element();

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(trigger).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);

		expect(
			(await axe.run(probe)).violations
		).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
