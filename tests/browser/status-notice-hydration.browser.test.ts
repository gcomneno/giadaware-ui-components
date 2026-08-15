import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import StatusNoticeHydrationProbe from '../fixtures/StatusNoticeHydrationProbe.svelte';
import { STATUS_NOTICE_HYDRATION_SSR_BODY } from '../fixtures/status-notice-hydration-contract.js';

test('hydrates StatusNotice without mismatch and reuses stable server nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML = STATUS_NOTICE_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="status-notice-hydration-probe"]'
	);
	const serverNotice = container.querySelector('#hydration-status-notice');
	const serverAnnouncement = container.querySelector(
		'.giu-status-notice__announcement'
	);
	const serverDismiss = container.querySelector(
		'.giu-status-notice__dismiss'
	);

	expect(serverRoot).toBeInstanceOf(HTMLElement);
	expect(serverNotice).toBeInstanceOf(HTMLElement);
	expect(serverAnnouncement).toBeInstanceOf(HTMLElement);
	expect(serverDismiss).toBeInstanceOf(HTMLButtonElement);

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
		component = hydrate(StatusNoticeHydrationProbe, {
			target: container,
			recover: false
		});
		await tick();

		const hydratedRoot = container.querySelector(
			'[data-testid="status-notice-hydration-probe"]'
		);
		const hydratedNotice = container.querySelector(
			'#hydration-status-notice'
		);
		const hydratedAnnouncement = container.querySelector(
			'.giu-status-notice__announcement'
		);
		const hydratedDismiss = container.querySelector(
			'.giu-status-notice__dismiss'
		);

		expect(hydratedRoot).toBe(serverRoot);
		expect(hydratedNotice).toBe(serverNotice);
		expect(hydratedAnnouncement).toBe(serverAnnouncement);
		expect(hydratedDismiss).toBe(serverDismiss);
		expect(hydratedNotice).toHaveAttribute(
			'data-giu-tone',
			'success'
		);
		expect(hydratedAnnouncement).toHaveAttribute('role', 'alert');
		expect(hydratedAnnouncement).toHaveAttribute(
			'aria-live',
			'assertive'
		);
		expect(hydratedAnnouncement).toHaveAttribute(
			'aria-atomic',
			'true'
		);
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		(hydratedDismiss as HTMLButtonElement).click();
		await tick();

		expect(hydratedRoot).toHaveAttribute('data-dismiss-count', '1');
		expect(container.querySelector('#hydration-status-notice')).toBe(
			hydratedNotice
		);
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		await unmount(component);
		component = undefined;

		expect(
			container.querySelector(
				'[data-testid="status-notice-hydration-probe"]'
			)
		).toBeNull();
	} finally {
		if (component) {
			await unmount(component);
		}

		warnSpy.mockRestore();
		errorSpy.mockRestore();
		container.remove();
	}
});
