import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import {
	TABS_HYDRATION_SSR_BODY
} from '../fixtures/tabs-hydration-contract.js';
import TabsHydrationProbe from '../fixtures/TabsHydrationProbe.svelte';

test('hydrates Tabs without replacing nodes, mutating controlled state or changing relationship IDs', async () => {
	const container = document.createElement('div');
	container.innerHTML = TABS_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverProbe = container.querySelector(
		'[data-testid="tabs-hydration-probe"]'
	);
	const serverRoot = container.querySelector(
		'[data-testid="tabs-hydration-root"]'
	) as HTMLDivElement;
	const serverList = container.querySelector(
		'[data-testid="tabs-hydration-list"]'
	) as HTMLDivElement;
	const serverOverview = container.querySelector(
		'[data-testid="tabs-hydration-overview"]'
	) as HTMLButtonElement;
	const serverDetails = container.querySelector(
		'[data-testid="tabs-hydration-details"]'
	) as HTMLButtonElement;
	const serverOverviewPanel = container.querySelector(
		'[data-testid="tabs-hydration-overview-panel"]'
	) as HTMLDivElement;
	const serverDetailsPanel = container.querySelector(
		'[data-testid="tabs-hydration-details-panel"]'
	) as HTMLDivElement;
	const serverAction = container.querySelector(
		'[data-testid="tabs-hydration-action"]'
	) as HTMLButtonElement;

	expect(serverProbe).not.toBeNull();
	expect(serverRoot).not.toBeNull();
	expect(serverList).not.toBeNull();
	expect(serverOverview).not.toBeNull();
	expect(serverDetails).not.toBeNull();
	expect(serverOverviewPanel).not.toBeNull();
	expect(serverDetailsPanel).not.toBeNull();
	expect(serverAction).not.toBeNull();

	const rootId = serverRoot.id;
	const overviewId = serverOverview.id;
	const detailsId = serverDetails.id;
	const overviewPanelId = serverOverviewPanel.id;
	const detailsPanelId = serverDetailsPanel.id;

	expect(rootId.length).toBeGreaterThan(0);
	expect(serverProbe).toHaveAttribute(
		'data-value',
		'overview'
	);
	expect(serverProbe).toHaveAttribute(
		'data-requests',
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
		component = hydrate(TabsHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-probe"]'
			)
		).toBe(serverProbe);
		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-root"]'
			)
		).toBe(serverRoot);
		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-list"]'
			)
		).toBe(serverList);
		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-overview"]'
			)
		).toBe(serverOverview);
		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-details"]'
			)
		).toBe(serverDetails);
		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-overview-panel"]'
			)
		).toBe(serverOverviewPanel);
		expect(
			container.querySelector(
				'[data-testid="tabs-hydration-details-panel"]'
			)
		).toBe(serverDetailsPanel);

		expect(serverRoot.id).toBe(rootId);
		expect(serverOverview.id).toBe(overviewId);
		expect(serverDetails.id).toBe(detailsId);
		expect(serverOverviewPanel.id).toBe(
			overviewPanelId
		);
		expect(serverDetailsPanel.id).toBe(
			detailsPanelId
		);

		expect(serverProbe).toHaveAttribute(
			'data-value',
			'overview'
		);
		expect(serverProbe).toHaveAttribute(
			'data-requests',
			'0'
		);
		expect(serverOverview).toHaveAttribute(
			'aria-selected',
			'true'
		);
		expect(serverDetails).toHaveAttribute(
			'aria-selected',
			'false'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		serverOverview.focus();
		await userEvent.keyboard('{ArrowRight}');

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(serverDetails)
		);
		await vi.waitFor(() => {
			expect(serverProbe).toHaveAttribute(
				'data-value',
				'details'
			);
			expect(serverProbe).toHaveAttribute(
				'data-requests',
				'1'
			);
		});

		expect(serverOverview).toHaveAttribute(
			'aria-selected',
			'false'
		);
		expect(serverOverview).toHaveAttribute(
			'tabindex',
			'-1'
		);
		expect(serverDetails).toHaveAttribute(
			'aria-selected',
			'true'
		);
		expect(serverDetails).toHaveAttribute(
			'tabindex',
			'0'
		);
		expect(serverOverviewPanel.hidden).toBe(true);
		expect(serverDetailsPanel.hidden).toBe(false);

		serverAction.click();

		await vi.waitFor(() =>
			expect(serverProbe).toHaveAttribute(
				'data-action-count',
				'1'
			)
		);

		expect(serverRoot.id).toBe(rootId);
		expect(serverOverview.id).toBe(overviewId);
		expect(serverDetails.id).toBe(detailsId);
		expect(serverOverviewPanel.id).toBe(
			overviewPanelId
		);
		expect(serverDetailsPanel.id).toBe(
			detailsPanelId
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
