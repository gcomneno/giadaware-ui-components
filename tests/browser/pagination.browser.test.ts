import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import PaginationProbe from '../fixtures/PaginationProbe.svelte';

test('marks the controlled page current and exposes consumer labels', async () => {
	const screen = await render(PaginationProbe);

	try {
		const nav = screen.getByRole(
			'navigation',
			{ name: 'Results pages' }
		);

		expect(nav).toBeVisible();

		const current = screen.getByRole(
			'button',
			{ name: 'Go to page 2' }
		);

		expect(current).toHaveAttribute(
			'aria-current',
			'page'
		);

		expect(
			screen.getByRole(
				'button',
				{ name: 'Previous' }
			)
		).not.toBeDisabled();

		expect(
			screen.getByRole(
				'button',
				{ name: 'Next' }
			)
		).not.toBeDisabled();
	} finally {
		await screen.unmount();
	}
});

test('previous requests exactly one previous page change', async () => {
	const screen = await render(PaginationProbe);

	try {
		const probe = screen.getByTestId(
			'pagination-probe'
		);

		await screen.getByRole(
			'button',
			{ name: 'Previous' }
		).click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-requested-page',
				'1'
			)
		);

		expect(probe).toHaveAttribute(
			'data-request-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('next requests exactly one next page change', async () => {
	const screen = await render(PaginationProbe);

	try {
		const probe = screen.getByTestId(
			'pagination-probe'
		);

		await screen.getByRole(
			'button',
			{ name: 'Next' }
		).click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-requested-page',
				'3'
			)
		);

		expect(probe).toHaveAttribute(
			'data-request-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('page button requests its page exactly once', async () => {
	const screen = await render(PaginationProbe);

	try {
		const probe = screen.getByTestId(
			'pagination-probe'
		);

		await screen.getByRole(
			'button',
			{ name: 'Go to page 4' }
		).click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-requested-page',
				'4'
			)
		);

		expect(probe).toHaveAttribute(
			'data-request-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('current page click does not emit a redundant request', async () => {
	const screen = await render(PaginationProbe);

	try {
		const probe = screen.getByTestId(
			'pagination-probe'
		);

		await screen.getByRole(
			'button',
			{ name: 'Go to page 2' }
		).click();

		expect(probe).toHaveAttribute(
			'data-requested-page',
			'none'
		);
		expect(probe).toHaveAttribute(
			'data-request-count',
			'0'
		);
	} finally {
		await screen.unmount();
	}
});

test('first and last page boundaries are disabled appropriately', async () => {
	const first = await render(PaginationProbe, {
		page: 1,
		pageCount: 4
	});

	try {
		expect(
			first.getByRole(
				'button',
				{ name: 'Previous' }
			)
		).toBeDisabled();

		expect(
			first.getByRole(
				'button',
				{ name: 'Next' }
			)
		).not.toBeDisabled();
	} finally {
		await first.unmount();
	}

	const last = await render(PaginationProbe, {
		page: 4,
		pageCount: 4
	});

	try {
		expect(
			last.getByRole(
				'button',
				{ name: 'Previous' }
			)
		).not.toBeDisabled();

		expect(
			last.getByRole(
				'button',
				{ name: 'Next' }
			)
		).toBeDisabled();
	} finally {
		await last.unmount();
	}
});

test('invalid controlled state disables all interaction', async () => {
	const screen = await render(PaginationProbe, {
		page: 5,
		pageCount: 4
	});

	try {
		const probe = screen.getByTestId(
			'pagination-probe'
		);
		const buttons = Array.from(
			probe.element().querySelectorAll('button')
		);

		expect(buttons.length).toBe(6);
		expect(
			buttons.every((button) => button.disabled)
		).toBe(true);

		expect(probe).toHaveAttribute(
			'data-request-count',
			'0'
		);
	} finally {
		await screen.unmount();
	}
});

test('renders with no axe violations', async () => {
	const screen = await render(PaginationProbe);

	try {
		const probe = screen.getByTestId(
			'pagination-probe'
		).element();

		expect(
			(await axe.run(probe)).violations
		).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
