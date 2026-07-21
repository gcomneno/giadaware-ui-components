import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import AsyncOperationPanelProbe from '../fixtures/AsyncOperationPanelProbe.svelte';

test('has accessible actions, status regions, and disclosure without duplicate live regions', async () => {
	await render(AsyncOperationPanelProbe);
	const root = document.querySelector('[data-testid="async-operation-panel-probe"]');
	if (!(root instanceof HTMLElement)) throw new TypeError('Probe missing');
	expect(root.querySelectorAll('section h2')).toHaveLength(5);
	expect(root.querySelectorAll('section h3')).toHaveLength(1);
	expect([...root.querySelectorAll('button')].map((button) => button.textContent)).toEqual([
		'Run idle', 'Run running', 'Run success', 'Run warning', 'Run error', 'Run detailed'
	]);
	expect(root.querySelectorAll('[aria-live]')).toHaveLength(5);
	expect(root.querySelectorAll('[role="alert"]')).toHaveLength(1);
	const results = await axe.run(root);
	expect(results.violations).toHaveLength(0);
});
