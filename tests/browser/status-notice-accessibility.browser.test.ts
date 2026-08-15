import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import StatusNoticeAccessibilityProbe from '../fixtures/StatusNoticeAccessibilityProbe.svelte';

test('has explicit live-region opt-in and no Axe violations', async () => {
	await render(StatusNoticeAccessibilityProbe);

	const root = document.querySelector(
		'[data-testid="status-notice-accessibility-probe"]'
	);

	if (!(root instanceof HTMLElement)) {
		throw new TypeError(
			'StatusNotice accessibility probe was not rendered.'
		);
	}

	const notices = root.querySelectorAll('.giu-status-notice');
	const statuses = root.querySelectorAll('[role="status"]');
	const alerts = root.querySelectorAll('[role="alert"]');
	const liveRegions = root.querySelectorAll('[aria-live]');
	const atomicRegions = root.querySelectorAll('[aria-atomic]');

	expect(notices).toHaveLength(4);
	expect(statuses).toHaveLength(1);
	expect(alerts).toHaveLength(1);
	expect(liveRegions).toHaveLength(2);
	expect(atomicRegions).toHaveLength(2);
	expect(
		[...liveRegions].every((element) =>
			element.classList.contains('giu-status-notice__announcement')
		)
	).toBe(true);

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
