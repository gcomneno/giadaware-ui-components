import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import { PANEL_HYDRATION_SSR_BODY } from '../fixtures/panel-hydration-contract.js';
import PanelHydrationProbe from '../fixtures/PanelHydrationProbe.svelte';

test('hydrates Panel without replacing its semantic nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML = PANEL_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="panel-hydration-probe"]',
	);
	const serverPanels = [...container.querySelectorAll('section')];
	const serverHeaders = [...container.querySelectorAll('header')];
	const serverHeadings = [...container.querySelectorAll('h2, h3, h4, h5, h6')];
	const serverBodies = [...container.querySelectorAll('.giu-panel__body')];

	if (!(serverRoot instanceof HTMLElement)) {
		throw new TypeError('Server Panel hydration root missing');
	}

	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(PanelHydrationProbe, {
			target: container,
			recover: false,
		});

		await tick();

		expect(
			container.querySelector('[data-testid="panel-hydration-probe"]'),
		).toBe(serverRoot);
		expect([...container.querySelectorAll('section')]).toEqual(serverPanels);
		expect([...container.querySelectorAll('header')]).toEqual(serverHeaders);
		expect([...container.querySelectorAll('h2, h3, h4, h5, h6')]).toEqual(
			serverHeadings,
		);
		expect([...container.querySelectorAll('.giu-panel__body')]).toEqual(
			serverBodies,
		);

		expect(serverPanels[0]).toHaveAttribute('aria-labelledby', 's1-title');
		expect(serverPanels[1]).toHaveAttribute(
			'aria-labelledby',
			'fixed-panel-title',
		);
		expect(serverHeadings[0]).toHaveAttribute('id', 's1-title');
		expect(serverHeadings[1]).toHaveAttribute('id', 'fixed-panel-title');

		const generatedAction = serverPanels[0].querySelector('button');
		const fixedForm = serverPanels[1].querySelector('form');

		if (
			!(generatedAction instanceof HTMLButtonElement) ||
			!(fixedForm instanceof HTMLFormElement)
		) {
			throw new TypeError('Hydrated Panel controls missing');
		}

		generatedAction.click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-action-count', '1'),
		);

		fixedForm.requestSubmit();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-action-count', '2'),
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
