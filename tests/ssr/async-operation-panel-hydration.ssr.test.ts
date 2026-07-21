import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import AsyncOperationPanelHydrationProbe from '../fixtures/AsyncOperationPanelHydrationProbe.svelte';
import { ASYNC_OPERATION_PANEL_HYDRATION_SSR_BODY } from '../fixtures/async-operation-panel-hydration-contract.js';

test('produces deterministic collapsed and expanded disclosure hydration markup', () => {
	const first = render(AsyncOperationPanelHydrationProbe);
	expect(first).toEqual(render(AsyncOperationPanelHydrationProbe));
	expect(first.body.match(/<details/g)).toHaveLength(2);
	expect(first.body.match(/<details[^>]* open/g)).toHaveLength(1);
	expect(first.body).toBe(ASYNC_OPERATION_PANEL_HYDRATION_SSR_BODY);
});
