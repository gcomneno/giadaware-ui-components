import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	TOOLTIP_HYDRATION_SSR_BODY
} from '../fixtures/tooltip-hydration-contract.js';
import TooltipHydrationProbe from '../fixtures/TooltipHydrationProbe.svelte';

test('hydrates Tooltip without replacing nodes or changing its relationship id', async () => {
	const container = document.createElement('div');
	container.innerHTML = TOOLTIP_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverProbe = container.querySelector(
		'[data-testid="tooltip-hydration-probe"]'
	) as HTMLDivElement | null;
	const serverTrigger = container.querySelector(
		'[data-testid="tooltip-hydration-trigger"]'
	) as HTMLButtonElement | null;

	expect(serverProbe).not.toBeNull();
	expect(serverTrigger).not.toBeNull();

	if (!serverProbe || !serverTrigger) {
		throw new TypeError(
			'Expected server Tooltip nodes.'
		);
	}

	const tooltipId = serverTrigger.getAttribute(
		'aria-describedby'
	);

	expect(tooltipId).not.toBeNull();

	if (!tooltipId) {
		throw new TypeError(
			'Expected server aria-describedby.'
		);
	}

	const serverTooltip = container.querySelector(
		`#${CSS.escape(tooltipId)}`
	) as HTMLDivElement | null;

	expect(serverTooltip).not.toBeNull();

	if (!serverTooltip) {
		throw new TypeError(
			'Expected server tooltip element.'
		);
	}

	expect(serverTooltip.hidden).toBe(true);
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
		component = hydrate(TooltipHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="tooltip-hydration-probe"]'
			)
		).toBe(serverProbe);
		expect(
			container.querySelector(
				'[data-testid="tooltip-hydration-trigger"]'
			)
		).toBe(serverTrigger);
		expect(
			container.querySelector(
				`#${CSS.escape(tooltipId)}`
			)
		).toBe(serverTooltip);

		expect(
			serverTrigger.getAttribute(
				'aria-describedby'
			)
		).toBe(tooltipId);

		expect(serverTooltip.hidden).toBe(true);
		expect(serverProbe).toHaveAttribute(
			'data-action-count',
			'0'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		serverTrigger.focus();

		await vi.waitFor(() =>
			expect(serverTooltip.hidden).toBe(false)
		);

		serverTrigger.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true
			})
		);

		await vi.waitFor(() =>
			expect(serverTooltip.hidden).toBe(true)
		);

		serverTrigger.click();

		await vi.waitFor(() =>
			expect(serverProbe).toHaveAttribute(
				'data-action-count',
				'1'
			)
		);

		expect(
			serverTrigger.getAttribute(
				'aria-describedby'
			)
		).toBe(tooltipId);
		expect(serverTooltip.id).toBe(tooltipId);

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
