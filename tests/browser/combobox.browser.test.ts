import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import ComboboxProbe from '../fixtures/ComboboxProbe.svelte';

function inputOf(
	screen: Awaited<ReturnType<typeof render>>
): HTMLInputElement {
	return screen.getByRole(
		'combobox',
		{ name: 'City' }
	).element() as HTMLInputElement;
}

test('starts closed with selected value represented independently from query', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);

		expect(input.value).toBe('Beta');
		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		expect(input).not.toHaveAttribute(
			'aria-activedescendant'
		);

		expect(probe).toHaveAttribute(
			'data-value',
			'beta'
		);
		expect(probe).toHaveAttribute(
			'data-query',
			'Beta'
		);
	} finally {
		await screen.unmount();
	}
});

test('ArrowDown opens on the selected enabled option while focus stays on the input', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const input = inputOf(screen);

		input.focus();
		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);

		expect(document.activeElement).toBe(input);

		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-2'
		);

		expect(
			document.getElementById('cities-option-2')
		).toHaveClass(
			'giu-combobox__option--active'
		);
	} finally {
		await screen.unmount();
	}
});

test('arrow navigation wraps and skips disabled options', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const input = inputOf(screen);

		input.focus();

		await userEvent.keyboard('{ArrowDown}');
		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-2'
		);

		await userEvent.keyboard('{ArrowDown}');
		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-3'
		);

		await userEvent.keyboard('{ArrowDown}');
		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-0'
		);

		await userEvent.keyboard('{ArrowDown}');
		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-2'
		);

		await userEvent.keyboard('{ArrowUp}');
		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-0'
		);
	} finally {
		await screen.unmount();
	}
});

test('Home and End preserve the current active descendant for native text editing', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const input = inputOf(screen);

		input.focus();
		await userEvent.keyboard('{ArrowDown}');

		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-2'
		);

		await userEvent.keyboard('{Home}');

		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-2'
		);

		await userEvent.keyboard('{End}');

		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'cities-option-2'
		);
	} finally {
		await screen.unmount();
	}
});

test('Enter selects active option exactly once and keeps focus on input', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);

		input.focus();

		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{Enter}');

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-value',
				'gamma'
			)
		);

		await vi.waitFor(() =>
			expect(input.value).toBe('Gamma')
		);

		expect(probe).toHaveAttribute(
			'data-value-requests',
			'1'
		);
		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		expect(input).not.toHaveAttribute(
			'aria-activedescendant'
		);
		expect(document.activeElement).toBe(input);
	} finally {
		await screen.unmount();
	}
});

test('typing emits query changes without clearing committed value', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);

		await userEvent.clear(input);
		await userEvent.type(input, 'Gam');

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-query',
				'Gam'
			)
		);

		expect(probe).toHaveAttribute(
			'data-value',
			'beta'
		);

		expect(
			Number(
				probe.element().getAttribute(
					'data-query-requests'
				)
			)
		).toBeGreaterThan(0);

		expect(probe).toHaveAttribute(
			'data-value-requests',
			'0'
		);

		expect(input).toHaveAttribute(
			'aria-expanded',
			'true'
		);
	} finally {
		await screen.unmount();
	}
});

test('Escape closes without changing controlled value', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);

		input.focus();

		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{Escape}');

		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		expect(input).not.toHaveAttribute(
			'aria-activedescendant'
		);
		expect(probe).toHaveAttribute(
			'data-value',
			'beta'
		);
		expect(probe).toHaveAttribute(
			'data-value-requests',
			'0'
		);
	} finally {
		await screen.unmount();
	}
});

test('Tab closes without trapping focus', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const input = inputOf(screen);
		const outside = screen.getByTestId(
			'outside-control'
		).element() as HTMLButtonElement;

		input.focus();
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.tab();

		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		expect(document.activeElement).toBe(outside);
	} finally {
		await screen.unmount();
	}
});

test('pointer selection preserves input focus and selects exactly once', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);

		input.focus();
		input.click();

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);

		const gamma = document.getElementById(
			'cities-option-3'
		);

		if (!(gamma instanceof HTMLElement)) {
			throw new TypeError(
				'Expected Gamma option.'
			);
		}

		await userEvent.click(gamma);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-value',
				'gamma'
			)
		);

		expect(probe).toHaveAttribute(
			'data-value-requests',
			'1'
		);
		expect(document.activeElement).toBe(input);
		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	} finally {
		await screen.unmount();
	}
});

test('disabled option cannot be selected', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);

		input.focus();
		input.click();

		const blocked = document.getElementById(
			'cities-option-1'
		);

		if (!(blocked instanceof HTMLElement)) {
			throw new TypeError(
				'Expected disabled option.'
			);
		}

		blocked.click();

		expect(probe).toHaveAttribute(
			'data-value',
			'beta'
		);
		expect(probe).toHaveAttribute(
			'data-value-requests',
			'0'
		);
	} finally {
		await screen.unmount();
	}
});

test('outside pointer closes the popup without mutating controlled value', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		);
		const input = inputOf(screen);
		const outside = screen.getByTestId(
			'outside-control'
		);

		input.click();

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);

		outside.element().dispatchEvent(
			new PointerEvent(
				'pointerdown',
				{ bubbles: true }
			)
		);

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'false'
			)
		);

		expect(probe).toHaveAttribute(
			'data-value',
			'beta'
		);
		expect(probe).toHaveAttribute(
			'data-value-requests',
			'0'
		);
	} finally {
		await screen.unmount();
	}
});

test('disabled combobox remains closed and non-interactive', async () => {
	const screen = await render(ComboboxProbe, {
		disabled: true
	});

	try {
		const input = inputOf(screen);

		expect(input.disabled).toBe(true);
		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);

		input.click();

		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	} finally {
		await screen.unmount();
	}
});

test('renders accessible combobox semantics with no axe violations', async () => {
	const screen = await render(ComboboxProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-probe'
		).element();

		expect(
			(await axe.run(probe)).violations
		).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
