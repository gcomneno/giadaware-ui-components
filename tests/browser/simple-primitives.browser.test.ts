import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import SimplePrimitivesProbe from '../fixtures/SimplePrimitivesProbe.svelte';

test('TextInput preserves native editing and bound value', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const probe = screen.getByTestId(
			'simple-primitives-probe'
		);
		const input = screen.getByRole(
			'textbox',
			{ name: 'Text field' }
		);

		await userEvent.clear(input);
		await userEvent.type(input, 'updated');

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-text',
				'updated'
			)
		);
	} finally {
		await screen.unmount();
	}
});

test('Textarea preserves native editing, binding and resize hook', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const probe = screen.getByTestId(
			'simple-primitives-probe'
		);
		const textarea = screen.getByRole(
			'textbox',
			{ name: 'Notes' }
		);

		expect(textarea).toHaveClass(
			'giu-textarea--resize-both'
		);

		await userEvent.clear(textarea);
		await userEvent.type(
			textarea,
			'new notes'
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-textarea',
				'new notes'
			)
		);
	} finally {
		await screen.unmount();
	}
});

test('Select preserves single and multiple native value binding', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const probe = screen.getByTestId(
			'simple-primitives-probe'
		);

		const single = document.getElementById(
			'simple-single'
		);

		const multiple = document.getElementById(
			'simple-multiple'
		);

		if (
			!(single instanceof HTMLSelectElement) ||
			!(multiple instanceof HTMLSelectElement)
		) {
			throw new TypeError(
				'Expected native select elements.'
			);
		}

		single.value = 'gamma';
		single.dispatchEvent(
			new Event(
				'change',
				{ bubbles: true }
			)
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-single',
				'gamma'
			)
		);

		for (const option of multiple.options) {
			option.selected =
				option.value === 'beta' ||
				option.value === 'gamma';
		}

		multiple.dispatchEvent(
			new Event(
				'change',
				{ bubbles: true }
			)
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-multiple',
				'beta,gamma'
			)
		);
	} finally {
		await screen.unmount();
	}
});

test('Disclosure uses native details behavior and synchronizes open binding', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const probe = screen.getByTestId(
			'simple-primitives-probe'
		);
		const details = screen.getByTestId(
			'simple-disclosure'
		).element() as HTMLDetailsElement;
		const summary = details.querySelector('summary');

		if (!(summary instanceof HTMLElement)) {
			throw new TypeError(
				'Expected native summary.'
			);
		}

		expect(details.open).toBe(false);

		summary.click();

		await vi.waitFor(() =>
			expect(details.open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-disclosure-open',
				'true'
			)
		);
	} finally {
		await screen.unmount();
	}
});

test('NavList preserves native navigation and aria-current semantics', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const nav = screen.getByRole(
			'navigation',
			{ name: 'Project sections' }
		);

		expect(nav).toBeVisible();

		expect(
			screen.getByRole(
				'link',
				{ name: 'Overview' }
			)
		).toHaveAttribute(
			'aria-current',
			'page'
		);

		expect(
			screen.getByRole(
				'link',
				{ name: 'Settings' }
			)
		).toHaveAttribute(
			'aria-current',
			'step'
		);

		expect(
			screen.getByRole(
				'link',
				{ name: 'Help' }
			)
		).not.toHaveAttribute(
			'aria-current'
		);
	} finally {
		await screen.unmount();
	}
});

test('Table family preserves native table semantics', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const table = screen.getByRole(
			'table',
			{ name: 'Build status' }
		);

		expect(table).toBeVisible();

		const tableElement = table.element();

		expect(
			tableElement.querySelectorAll('th')
		).toHaveLength(2);

		expect(
			tableElement.querySelectorAll('td')
		).toHaveLength(4);
	} finally {
		await screen.unmount();
	}
});

test('simple primitives render with no axe violations', async () => {
	const screen = await render(SimplePrimitivesProbe);

	try {
		const probe = screen.getByTestId(
			'simple-primitives-probe'
		).element();

		expect(
			(await axe.run(probe)).violations
		).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
