import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { PANEL_HYDRATION_SSR_BODY } from '../fixtures/panel-hydration-contract.js';
import PanelHydrationProbe from '../fixtures/PanelHydrationProbe.svelte';

test('produces deterministic Panel hydration markup', () => {
	const first = render(PanelHydrationProbe);

	expect(first).toEqual(render(PanelHydrationProbe));
	expect(first.body).toBe(PANEL_HYDRATION_SSR_BODY);
	expect(first.body.match(/<section/g)).toHaveLength(2);
	expect(first.body).toContain('aria-labelledby="s1-title"');
	expect(first.body).toContain('<h2 id="s1-title"');
	expect(first.body).toContain('id="fixed-panel"');
	expect(first.body).toContain('aria-labelledby="fixed-panel-title"');
	expect(first.body).toContain('<h4 id="fixed-panel-title"');
});
