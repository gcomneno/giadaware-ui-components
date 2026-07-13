import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import SocialIconAccessibilityProbe from '../fixtures/SocialIconAccessibilityProbe.svelte';

test('has no automatically detectable accessibility violations', async () => {
	await render(SocialIconAccessibilityProbe);

	const root = document.querySelector(
		'[data-testid="social-icon-accessibility-probe"]'
	);

	expect(root).not.toBeNull();

	if (!(root instanceof HTMLElement)) {
		throw new TypeError(
			'SocialIcon accessibility probe was not rendered.'
		);
	}

	const results = await axe.run(root);

	if (results.violations.length > 0) {
		const details = results.violations.map((violation) => ({
			id: violation.id,
			impact: violation.impact,
			description: violation.description,
			nodes: violation.nodes.map((node) => node.target)
		}));

		throw new Error(
			`Accessibility violations found:
${JSON.stringify(details, null, 2)}`
		);
	}

	expect(results.violations).toHaveLength(0);
});
