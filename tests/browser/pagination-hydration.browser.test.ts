import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	PAGINATION_HYDRATION_SSR_BODY
} from '../fixtures/pagination-hydration-contract.js';
import PaginationHydrationProbe from '../fixtures/PaginationHydrationProbe.svelte';

test('hydrates Pagination without replacing nodes and preserves controlled behavior', async () => {
	const container = document.createElement('div');
	container.innerHTML =
		PAGINATION_HYDRATION_SSR_BODY;
	document.body.append(container);

	const probe = container.querySelector(
		'[data-testid="pagination-hydration-probe"]'
	) as HTMLDivElement | null;
	const nav = container.querySelector(
		'nav'
	) as HTMLElement | null;
	const buttons = Array.from(
		container.querySelectorAll('button')
	);

	expect(probe).not.toBeNull();
	expect(nav).not.toBeNull();
	expect(buttons).toHaveLength(5);

	if (!probe || !nav) {
		throw new TypeError(
			'Expected server Pagination nodes.'
		);
	}

	const serverButtons = [...buttons];

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(PaginationHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="pagination-hydration-probe"]'
			)
		).toBe(probe);

		expect(
			container.querySelector('nav')
		).toBe(nav);

		const hydratedButtons = Array.from(
			container.querySelectorAll('button')
		);

		expect(hydratedButtons).toHaveLength(
			serverButtons.length
		);

		for (
			let index = 0;
			index < serverButtons.length;
			index += 1
		) {
			expect(
				hydratedButtons[index]
			).toBe(serverButtons[index]);
		}

		expect(probe).toHaveAttribute(
			'data-page',
			'2'
		);
		expect(probe).toHaveAttribute(
			'data-request-count',
			'0'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		const next = hydratedButtons.at(-1);

		if (!(next instanceof HTMLButtonElement)) {
			throw new TypeError(
				'Expected next pagination button.'
			);
		}

		next.click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-page',
				'3'
			)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-request-count',
				'1'
			)
		);

		const current = container.querySelector(
			'button[aria-current="page"]'
		);

		expect(current).toHaveAttribute(
			'aria-label',
			'Page 3'
		);

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
