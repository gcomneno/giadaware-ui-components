import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { SURFACE_HYDRATION_SSR_BODY } from '../fixtures/surface-hydration-contract.js';
import SurfaceHydrationProbe from '../fixtures/SurfaceHydrationProbe.svelte';

test('produces deterministic Surface hydration markup', () => {
	const first = render(SurfaceHydrationProbe);

	expect(first).toEqual(render(SurfaceHydrationProbe));
	expect(first.body).toBe(SURFACE_HYDRATION_SSR_BODY);
	expect(first.body.match(/class="giu-surface/g)).toHaveLength(2);
	expect(first.body).toContain('<nav aria-label="Resources">');

	const surfaceOpeningTags =
		first.body.match(/<div class="giu-surface[^>]*>/g) ?? [];

	expect(surfaceOpeningTags).toHaveLength(2);

	for (const openingTag of surfaceOpeningTags) {
		expect(openingTag).not.toContain('role=');
		expect(openingTag).not.toContain('aria-label');
		expect(openingTag).not.toContain('aria-labelledby');
	}

	expect(first.body).not.toContain('<section');
	expect(first.body).not.toContain('<header');
	expect(first.body).not.toMatch(/<h[1-6](?:\s|>)/);
});
