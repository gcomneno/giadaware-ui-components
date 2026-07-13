import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FormStatusAccessibilityProbe from '../fixtures/FormStatusAccessibilityProbe.svelte';

test('has deterministic live-region semantics and no Axe violations', async () => {
	await render(FormStatusAccessibilityProbe);

	const root = document.querySelector(
		'[data-testid="form-status-accessibility-probe"]'
	);

	if (!(root instanceof HTMLElement)) {
		throw new TypeError(
			'FormStatus accessibility probe was not rendered.'
		);
	}

	const statuses = root.querySelectorAll('[role="status"]');
	const alerts = root.querySelectorAll('[role="alert"]');

	expect(statuses).toHaveLength(3);
	expect(alerts).toHaveLength(1);
	expect(
		[...statuses].every(
			(element) =>
				element.getAttribute('aria-live') === 'polite' &&
				element.getAttribute('aria-atomic') === 'true'
		)
	).toBe(true);
	expect(alerts[0]?.getAttribute('aria-live')).toBe('assertive');
	expect(alerts[0]?.getAttribute('aria-atomic')).toBe('true');

	const results = await axe.run(root);

	if (results.violations.length > 0) {
		throw new Error(
			`Accessibility violations found:\n${JSON.stringify(
				results.violations.map((violation) => ({
					id: violation.id,
					impact: violation.impact,
					nodes: violation.nodes.map((node) => node.target)
				})),
				null,
				2
			)}`
		);
	}

	expect(results.violations).toHaveLength(0);
});
