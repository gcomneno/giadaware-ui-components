import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

import { FieldLabel } from '../../src/lib/studio/index.js';

describe('FieldLabel SSR', () => {
	test('renders deterministic label-only presentation', () => {
		const first = render(FieldLabel, {
			props: {
				label: 'Display name',
			},
		});

		expect(first).toEqual(
			render(FieldLabel, {
				props: {
					label: 'Display name',
				},
			}),
		);
		expect(first.body).toContain('class="giu-field-label-row');
		expect(first.body).toContain('giu-field-label-row--plain');
		expect(first.body).toContain(
			'<span class="giu-field-label',
		);
		expect(first.body).toContain('Display name');
		expect(first.body).not.toContain('<label');
		expect(first.body).not.toContain('giu-field-label-marker');
		expect(first.body).not.toContain('giu-field-label-hint');
	});

	test('renders an accessible required marker only with resolved copy', () => {
		const { body } = render(FieldLabel, {
			props: {
				label: 'Email',
				required: true,
				requiredLabel: 'Required',
			},
		});

		expect(body).toContain('giu-field-label-row--required');
		expect(body).toContain('giu-field-label-marker--required');
		expect(body).toContain('aria-hidden="true"');
		expect(body).toContain('>*</span>');
		expect(body).toContain('Required');
		expect(body).not.toContain('giu-field-label-marker--optional');
	});

	test('renders resolved optional copy without inventing punctuation', () => {
		const { body } = render(FieldLabel, {
			props: {
				label: 'Nickname',
				optional: true,
				optionalLabel: 'Optional field',
			},
		});

		expect(body).toContain('giu-field-label-row--optional');
		expect(body).toContain('giu-field-label-marker--optional');
		expect(body).toContain('Optional field');
		expect(body).not.toContain('(Optional field)');
	});

	test('gives required state precedence over optional state', () => {
		const { body } = render(FieldLabel, {
			props: {
				label: 'Account code',
				required: true,
				optional: true,
				requiredLabel: 'Required',
				optionalLabel: 'Optional',
			},
		});

		expect(body).toContain('giu-field-label-row--required');
		expect(body).toContain('giu-field-label-marker--required');
		expect(body).toContain('Required');
		expect(body).not.toContain('giu-field-label-row--optional');
		expect(body).not.toContain('Optional');
	});

	test('omits inaccessible or unresolved markers', () => {
		const required = render(FieldLabel, {
			props: {
				label: 'Internal reference',
				required: true,
			},
		});
		const optional = render(FieldLabel, {
			props: {
				label: 'Internal note',
				optional: true,
				optionalLabel: '   ',
			},
		});

		expect(required.body).toContain('giu-field-label-row--required');
		expect(required.body).not.toContain('giu-field-label-marker');
		expect(required.body).not.toContain('>*</span>');
		expect(optional.body).toContain('giu-field-label-row--optional');
		expect(optional.body).not.toContain('giu-field-label-marker');
	});

	test('renders hint text and a supplied stable ID', () => {
		const { body } = render(FieldLabel, {
			props: {
				label: 'Username',
				hint: 'Use letters, numbers and dashes.',
				hintId: 'username-hint',
			},
		});

		expect(body).toContain(
			'<span id="username-hint" class="giu-field-label-hint',
		);
		expect(body).toContain('Use letters, numbers and dashes.');
	});

	test('omits empty hints and empty hint IDs', () => {
		const emptyHint = render(FieldLabel, {
			props: {
				label: 'Username',
				hint: '   ',
				hintId: 'username-hint',
			},
		});
		const emptyId = render(FieldLabel, {
			props: {
				label: 'Username',
				hint: 'Visible hint',
				hintId: '   ',
			},
		});

		expect(emptyHint.body).not.toContain('giu-field-label-hint');
		expect(emptyHint.body).not.toContain('username-hint');
		expect(emptyId.body).toContain('Visible hint');
		expect(emptyId.body).not.toContain('id=');
	});

	test('composes consumer class and forwards row style', () => {
		const { body } = render(FieldLabel, {
			props: {
				label: 'Display name',
				class: 'consumer-field-label',
				style: '--giu-field-label-row-gap: 0.5rem',
			},
		});

		expect(body).toContain(
			'giu-field-label-row giu-field-label-row--plain consumer-field-label',
		);
		expect(body).toContain(
			'style="--giu-field-label-row-gap: 0.5rem"',
		);
	});
});
