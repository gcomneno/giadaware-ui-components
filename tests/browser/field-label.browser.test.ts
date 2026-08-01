import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FieldLabelProbe from '../fixtures/FieldLabelProbe.svelte';

test('renders deterministic FieldLabel states and consumer-owned control semantics', async () => {
	await render(FieldLabelProbe);

	const root = document.querySelector('[data-testid="field-label-probe"]');
	if (!(root instanceof HTMLElement)) {
		throw new TypeError('FieldLabel probe missing');
	}

	const rows = [
		...root.querySelectorAll<HTMLElement>('.giu-field-label-row'),
	];

	expect(rows).toHaveLength(7);
	expect(root.querySelectorAll('label')).toHaveLength(7);
	expect(root.querySelectorAll('input')).toHaveLength(7);
	expect(root.querySelector('label .giu-field-label-row')).not.toBeNull();
	expect(root.querySelector('.giu-field-label-row label')).toBeNull();

	const requiredField = root.querySelector(
		'[data-testid="required-field"]',
	);
	const optionalField = root.querySelector(
		'[data-testid="optional-field"]',
	);
	const precedenceField = root.querySelector(
		'[data-testid="precedence-field"]',
	);
	const fallbackField = root.querySelector(
		'[data-testid="fallback-field"]',
	);

	if (
		!(requiredField instanceof HTMLElement) ||
		!(optionalField instanceof HTMLElement) ||
		!(precedenceField instanceof HTMLElement) ||
		!(fallbackField instanceof HTMLElement)
	) {
		throw new TypeError('FieldLabel state fixtures missing');
	}

	expect(
		requiredField.querySelector('.giu-field-label-row'),
	).toHaveClass(
		'giu-field-label-row--required',
		'consumer-field-label',
	);
	expect(
		requiredField.querySelector('.giu-field-label-marker--required'),
	).toHaveTextContent('* Required');
	expect(
		requiredField.querySelector('.giu-field-label-hint'),
	).toHaveAttribute('id', 'required-hint');
	expect(
		requiredField.querySelector('input'),
	).toHaveAttribute('required');
	expect(
		requiredField.querySelector('input'),
	).toHaveAttribute('aria-describedby', 'required-hint');

	expect(
		optionalField.querySelector('.giu-field-label-row'),
	).toHaveClass('giu-field-label-row--optional');
	expect(
		optionalField.querySelector('.giu-field-label-marker--optional'),
	).toHaveTextContent('Optional');
	expect(optionalField.querySelector('input')).not.toHaveAttribute(
		'required',
	);

	expect(
		precedenceField.querySelector('.giu-field-label-row'),
	).toHaveClass('giu-field-label-row--required');
	expect(
		precedenceField.querySelector(
			'.giu-field-label-marker--required',
		),
	).toHaveTextContent('* Required');
	expect(
		precedenceField.querySelector(
			'.giu-field-label-marker--optional',
		),
	).toBeNull();

	expect(
		fallbackField.querySelector('.giu-field-label-row'),
	).toHaveClass('giu-field-label-row--required');
	expect(
		fallbackField.querySelector('.giu-field-label-marker'),
	).toBeNull();

	const styledRow = requiredField.querySelector(
		'.consumer-field-label',
	);
	expect(styledRow).toHaveStyle(
		'--giu-field-label-row-gap: 0.5rem',
	);
	expect(styledRow).toHaveStyle(
		'--giu-field-label-color: rgb(32, 32, 32)',
	);
});

test('renders resolved hint text with consumer-supplied IDs', async () => {
	await render(FieldLabelProbe);

	const usernameHint = document.querySelector('#username-hint');
	const websiteHint = document.querySelector('#website-hint');

	expect(usernameHint).toHaveClass('giu-field-label-hint');
	expect(usernameHint).toHaveTextContent(
		'Use letters, numbers and dashes.',
	);
	expect(websiteHint).toHaveClass('giu-field-label-hint');
	expect(websiteHint).toHaveTextContent('Include the full URL.');
});
