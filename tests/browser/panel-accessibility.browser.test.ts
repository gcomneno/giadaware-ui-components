import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import PanelProbe from '../fixtures/PanelProbe.svelte';

test('names every section and preserves accessible consumer content', async () => {
	await render(PanelProbe);

	const root = document.querySelector('[data-testid="panel-probe"]');
	if (!(root instanceof HTMLElement)) {
		throw new TypeError('Panel probe missing');
	}

	const sections = [...root.querySelectorAll<HTMLElement>('section')];

	for (const section of sections) {
		const labelledBy = section.getAttribute('aria-labelledby');

		expect(labelledBy).toBeTruthy();
		expect(section.querySelector(`#${labelledBy}`)).not.toBeNull();
	}

	const results = await axe.run(root);
	expect(results.violations).toHaveLength(0);
});
