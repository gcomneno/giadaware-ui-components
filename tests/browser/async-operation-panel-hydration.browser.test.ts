import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import AsyncOperationPanelHydrationProbe from '../fixtures/AsyncOperationPanelHydrationProbe.svelte';
import { ASYNC_OPERATION_PANEL_HYDRATION_SSR_BODY } from '../fixtures/async-operation-panel-hydration-contract.js';

test('hydrates actions and preserves collapsed and expanded native disclosures', async () => {
	const container = document.createElement('div');
	container.innerHTML = ASYNC_OPERATION_PANEL_HYDRATION_SSR_BODY;
	document.body.append(container);
	const serverRoot = container.querySelector('[data-testid="async-operation-panel-hydration-probe"]');
	const serverPanels = [...container.querySelectorAll('section')];
	const serverDetails = [...container.querySelectorAll('details')];
	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	try {
		component = hydrate(AsyncOperationPanelHydrationProbe, { target: container, recover: false });
		await tick();
		expect(container.querySelector('[data-testid="async-operation-panel-hydration-probe"]')).toBe(serverRoot);
		expect([...container.querySelectorAll('section')]).toEqual(serverPanels);
		expect([...container.querySelectorAll('details')]).toEqual(serverDetails);
		expect(serverDetails.map((details) => details.open)).toEqual([false, true]);
		(serverPanels[0].querySelector('button') as HTMLButtonElement).click();
		await vi.waitFor(() => expect(serverRoot).toHaveAttribute('data-action-count', '1'));
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
