import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import ComboboxAuditProbe from '../fixtures/ComboboxAuditProbe.svelte';

function inputOf(
	screen: Awaited<ReturnType<typeof render>>
): HTMLInputElement {
	return screen.getByRole(
		'combobox',
		{ name: 'Audit city' }
	).element() as HTMLInputElement;
}

test('rejected controlled query reconciles to the authoritative value', async () => {
	const screen = await render(ComboboxAuditProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-audit-probe'
		);
		const input = inputOf(screen);

		input.value = 'Rejected';
		input.dispatchEvent(
			new InputEvent('input', {
				bubbles: true,
				inputType: 'insertText',
				data: 'Rejected'
			})
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-query-requests',
				'1'
			)
		);

		await vi.waitFor(() =>
			expect(input.value).toBe('Beta')
		);

		expect(probe).toHaveAttribute(
			'data-query',
			'Beta'
		);
	} finally {
		await screen.unmount();
	}
});

test('consumer onclick composes exactly once with popup opening', async () => {
	const screen = await render(ComboboxAuditProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-audit-probe'
		);
		const input = inputOf(screen);

		input.click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-click-count',
				'1'
			)
		);

		expect(input).toHaveAttribute(
			'aria-expanded',
			'true'
		);
	} finally {
		await screen.unmount();
	}
});

test('Home and End remain native text-editing keys', async () => {
	const screen = await render(ComboboxAuditProbe);

	try {
		const input = inputOf(screen);

		input.focus();
		await userEvent.keyboard('{ArrowDown}');

		const active = input.getAttribute(
			'aria-activedescendant'
		);

		expect(active).not.toBeNull();

		await userEvent.keyboard('{Home}');
		expect(
			input.getAttribute('aria-activedescendant')
		).toBe(active);

		await userEvent.keyboard('{End}');
		expect(
			input.getAttribute('aria-activedescendant')
		).toBe(active);
	} finally {
		await screen.unmount();
	}
});

test('Enter during IME composition does not commit the active option', async () => {
	const screen = await render(ComboboxAuditProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-audit-probe'
		);
		const input = inputOf(screen);

		input.focus();
		await userEvent.keyboard('{ArrowDown}');

		input.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true,
				isComposing: true
			})
		);

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'true'
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

test('disabling an open combobox closes and clears active descendant', async () => {
	const screen = await render(ComboboxAuditProbe);

	try {
		const input = inputOf(screen);
		const disable = screen.getByTestId(
			'combobox-audit-disable'
		).element() as HTMLButtonElement;

		input.click();

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);

		disable.click();

		await vi.waitFor(() => {
			expect(input.disabled).toBe(true);
			expect(input).toHaveAttribute(
				'aria-expanded',
				'false'
			);
			expect(input).not.toHaveAttribute(
				'aria-activedescendant'
			);
		});
	} finally {
		await screen.unmount();
	}
});

test('open combobox remains axe-clean', async () => {
	const screen = await render(ComboboxAuditProbe);

	try {
		const probe = screen.getByTestId(
			'combobox-audit-probe'
		).element();
		const input = inputOf(screen);

		input.click();

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
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
