import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FieldLabelProbe from '../fixtures/FieldLabelProbe.svelte';

test('supports representative labelled controls without owning native semantics', async () => {
	await render(FieldLabelProbe);

	const root = document.querySelector('[data-testid="field-label-probe"]');
	if (!(root instanceof HTMLElement)) {
		throw new TypeError('FieldLabel probe missing');
	}

	const requiredInput = root.querySelector('#required-input');
	const usernameInput = root.querySelector(
		'#required-with-hint-input',
	);
	const websiteInput = root.querySelector(
		'#optional-with-hint-input',
	);

	if (
		!(requiredInput instanceof HTMLInputElement) ||
		!(usernameInput instanceof HTMLInputElement) ||
		!(websiteInput instanceof HTMLInputElement)
	) {
		throw new TypeError('Representative FieldLabel controls missing');
	}

	expect(requiredInput).toHaveAccessibleName(
		expect.stringContaining('Email'),
	);
	expect(requiredInput).toHaveAttribute('required');
	expect(requiredInput).toHaveAttribute(
		'aria-describedby',
		'required-hint',
	);

	expect(usernameInput).toHaveAttribute('required');
	expect(usernameInput).toHaveAttribute(
		'aria-describedby',
		'username-hint',
	);
	expect(websiteInput).not.toHaveAttribute('required');
	expect(websiteInput).toHaveAttribute(
		'aria-describedby',
		'website-hint',
	);

	for (const symbol of root.querySelectorAll(
		'.giu-field-label-marker__symbol',
	)) {
		expect(symbol).toHaveAttribute('aria-hidden', 'true');
	}

	expect(root.querySelector('.giu-field-label-row label')).toBeNull();
	expect(root.querySelector('.giu-field-label-row input')).toBeNull();

	const results = await axe.run(root);
	expect(results.violations).toHaveLength(0);
});
