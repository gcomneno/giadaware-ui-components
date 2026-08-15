import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FieldDescriptionErrorProbe from '../fixtures/FieldDescriptionErrorProbe.svelte';

test('supports description and error associations with explicit live-region policy and zero Axe violations', async () => {
	const screen = await render(FieldDescriptionErrorProbe);
	const root = screen
		.getByTestId('field-description-error-probe')
		.element() as HTMLElement;

	const staticErrors = [
		root.querySelector('#account-code-error'),
		root.querySelector('#display-name-error')
	];

	for (const error of staticErrors) {
		expect(error).not.toHaveAttribute('role');
		expect(error).not.toHaveAttribute('aria-live');
		expect(error).not.toHaveAttribute('aria-atomic');
	}

	expect(root.querySelectorAll('[role="alert"]')).toHaveLength(0);

	let results = await axe.run(root);

	if (results.violations.length > 0) {
		throw new Error(
			`Accessibility violations before dynamic error:\n${JSON.stringify(
				results.violations.map((violation) => ({
					id: violation.id,
					impact: violation.impact,
					description: violation.description,
					help: violation.help,
					nodes: violation.nodes.map((node) => ({
						target: node.target,
						html: node.html,
						failureSummary: node.failureSummary
					}))
				})),
				null,
				2
			)}`
		);
	}

	expect(results.violations).toHaveLength(0);

	await screen
		.getByRole('button', { name: 'Show dynamic error' })
		.click();

	const liveError = root.querySelector('#dynamic-value-error');

	expect(liveError).toHaveAttribute('role', 'alert');
	expect(liveError).toHaveAttribute('aria-live', 'assertive');
	expect(liveError).toHaveAttribute('aria-atomic', 'true');
	expect(root.querySelectorAll('[role="alert"]')).toHaveLength(1);

	results = await axe.run(root);
	expect(results.violations).toHaveLength(0);
});
