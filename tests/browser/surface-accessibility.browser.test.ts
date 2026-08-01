import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import SurfaceProbe from '../fixtures/SurfaceProbe.svelte';

test('adds no implicit semantics and preserves accessible consumer markup', async () => {
	await render(SurfaceProbe);

	const root = document.querySelector('[data-testid="surface-probe"]');
	if (!(root instanceof HTMLElement)) {
		throw new TypeError('Surface probe missing');
	}

	const surfaces = [...root.querySelectorAll<HTMLElement>('.giu-surface')];

	for (const surface of surfaces) {
		expect(surface).not.toHaveAttribute('role');
		expect(surface).not.toHaveAttribute('aria-label');
		expect(surface).not.toHaveAttribute('aria-labelledby');
	}

	expect(root.querySelector('nav')).toHaveAccessibleName('Resources');
	expect(root.querySelector('input')).toHaveAccessibleName('Display name');

	const results = await axe.run(root);
	expect(results.violations).toHaveLength(0);
});
