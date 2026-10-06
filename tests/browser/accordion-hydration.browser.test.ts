import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	ACCORDION_HYDRATION_SSR_BODY
} from '../fixtures/accordion-hydration-contract.js';
import AccordionHydrationProbe from '../fixtures/AccordionHydrationProbe.svelte';

test('hydrates Accordion without replacing native details nodes or changing initial state', async () => {
	const container = document.createElement('div');
	container.innerHTML =
		ACCORDION_HYDRATION_SSR_BODY;
	document.body.append(container);

	const probe = container.querySelector(
		'[data-testid="accordion-hydration-probe"]'
	) as HTMLDivElement | null;
	const first = container.querySelector(
		'[data-testid="accordion-hydration-first"]'
	) as HTMLDetailsElement | null;
	const second = container.querySelector(
		'[data-testid="accordion-hydration-second"]'
	) as HTMLDetailsElement | null;
	const action = container.querySelector(
		'[data-testid="accordion-hydration-action"]'
	) as HTMLButtonElement | null;

	expect(probe).not.toBeNull();
	expect(first).not.toBeNull();
	expect(second).not.toBeNull();
	expect(action).not.toBeNull();

	if (!probe || !first || !second || !action) {
		throw new TypeError(
			'Expected server Accordion nodes.'
		);
	}

	expect(first.open).toBe(true);
	expect(second.open).toBe(false);

	const groupName = first.name;

	expect(groupName.length).toBeGreaterThan(0);
	expect(second.name).toBe(groupName);

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(AccordionHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="accordion-hydration-first"]'
			)
		).toBe(first);
		expect(
			container.querySelector(
				'[data-testid="accordion-hydration-second"]'
			)
		).toBe(second);
		expect(
			container.querySelector(
				'[data-testid="accordion-hydration-action"]'
			)
		).toBe(action);

		expect(first.open).toBe(true);
		expect(second.open).toBe(false);
		expect(first.name).toBe(groupName);
		expect(second.name).toBe(groupName);

		expect(probe).toHaveAttribute(
			'data-first-open',
			'true'
		);
		expect(probe).toHaveAttribute(
			'data-second-open',
			'false'
		);
		expect(probe).toHaveAttribute(
			'data-action-count',
			'0'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		const secondSummary =
			second.querySelector('summary');

		if (!(secondSummary instanceof HTMLElement)) {
			throw new TypeError(
				'Expected second summary.'
			);
		}

		secondSummary.click();

		await vi.waitFor(() =>
			expect(second.open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(first.open).toBe(false)
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-first-open',
				'false'
			)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-second-open',
				'true'
			)
		);

		action.click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-action-count',
				'1'
			)
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
