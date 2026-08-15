import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import { REORDER_ANNOUNCEMENT_HYDRATION_SSR_BODY } from '../fixtures/reorder-announcement-hydration-contract.js';
import ReorderAnnouncementHydrationProbe from '../fixtures/ReorderAnnouncementHydrationProbe.svelte';

test('hydrates ReorderAnnouncement without stale announcements or replacement', async () => {
	const container = document.createElement('div');
	container.innerHTML = REORDER_ANNOUNCEMENT_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="reorder-announcement-hydration-probe"]'
	);
	const serverLiveRegion = container.querySelector(
		'.giu-reorder-announcement'
	);

	expect(serverRoot).toBeInstanceOf(HTMLElement);
	expect(serverLiveRegion).toBeInstanceOf(HTMLElement);
	expect(serverLiveRegion?.textContent).toBe('');

	const warnings: unknown[][] = [];
	const errors: unknown[][] = [];
	const warnSpy = vi
		.spyOn(console, 'warn')
		.mockImplementation((...args: unknown[]) => warnings.push(args));
	const errorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation((...args: unknown[]) => errors.push(args));
	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(ReorderAnnouncementHydrationProbe, {
			target: container,
			recover: false
		});
		await tick();

		expect(container.querySelector('[data-testid="reorder-announcement-hydration-probe"]')).toBe(serverRoot);
		expect(container.querySelector('.giu-reorder-announcement')).toBe(serverLiveRegion);
		expect(serverLiveRegion).toHaveClass('consumer-announcement');
		expect(serverLiveRegion).toHaveStyle('--giu-reorder-announcement-size: 2px');
		expect(serverLiveRegion).toHaveAttribute('role', 'status');
		expect(serverLiveRegion).toHaveAttribute('aria-live', 'polite');
		expect(serverLiveRegion).toHaveAttribute('aria-atomic', 'true');
		expect(serverLiveRegion).toHaveTextContent('');

		(container.querySelector('button') as HTMLButtonElement).click();
		await tick();
		await tick();
		expect(serverLiveRegion).toHaveTextContent('');

		(
			container.querySelectorAll('button')[1] as HTMLButtonElement
		).click();
		await tick();
		expect(serverLiveRegion).toHaveTextContent('');
		await tick();
		expect(serverLiveRegion).toHaveTextContent(
			'Confirmed move after hydration'
		);
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);
	} finally {
		if (component) {
			await unmount(component);
		}

		warnSpy.mockRestore();
		errorSpy.mockRestore();
		container.remove();
	}
});
