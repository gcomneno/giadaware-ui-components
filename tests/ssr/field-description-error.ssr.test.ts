import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

import {
	FieldDescription,
	FieldError
} from '../../src/lib/studio/index.js';

describe('FieldDescription SSR', () => {
	test('renders deterministic static descriptive text with a consumer-owned ID', () => {
		const props = {
			text: '  Used for account notifications.  ',
			id: 'account-email-description'
		};

		const first = render(FieldDescription, { props });

		expect(first).toEqual(render(FieldDescription, { props }));
		expect(first.body).toContain('<p');
		expect(first.body).toContain('giu-field-description');
		expect(first.body).toContain(
			'id="account-email-description"'
		);
		expect(first.body).toContain(
			'  Used for account notifications.  '
		);
		expect(first.body).not.toContain('role=');
		expect(first.body).not.toContain('aria-live=');
		expect(first.body).not.toContain('aria-atomic=');
		expect(first.body).not.toContain('<label');
		expect(first.body).not.toContain('<input');
	});

	test('omits whitespace-only content and ignores an ID without rendered content', () => {
		const { body } = render(FieldDescription, {
			props: {
				text: '   ',
				id: 'unused-description'
			}
		});

		expect(body).not.toContain('<p');
		expect(body).not.toContain('unused-description');
	});

	test('does not rewrite a non-blank consumer-owned ID', () => {
		const { body } = render(FieldDescription, {
			props: {
				text: 'Description',
				id: '  consumer-description-id  '
			}
		});

		expect(body).toContain(
			'id="  consumer-description-id  "'
		);
	});

	test('omits a whitespace-only ID while preserving visible text', () => {
		const { body } = render(FieldDescription, {
			props: {
				text: 'Description',
				id: '   '
			}
		});

		expect(body).toContain('Description');
		expect(body).not.toContain('id=');
	});

	test('composes consumer class and style', () => {
		const { body } = render(FieldDescription, {
			props: {
				text: 'Description',
				class: 'consumer-description',
				style: '--giu-field-description-size: 1rem'
			}
		});

		expect(body).toContain(
			'giu-field-description consumer-description'
		);
		expect(body).toContain(
			'style="--giu-field-description-size: 1rem"'
		);
	});
});

describe('FieldError SSR', () => {
	test('renders static validation text without live-region semantics by default', () => {
		const props = {
			text: 'Enter a valid email address.',
			id: 'account-email-error'
		};

		const first = render(FieldError, { props });

		expect(first).toEqual(render(FieldError, { props }));
		expect(first.body).toContain('<p');
		expect(first.body).toContain('giu-field-error');
		expect(first.body).toContain('id="account-email-error"');
		expect(first.body).toContain('Enter a valid email address.');
		expect(first.body).not.toContain('role=');
		expect(first.body).not.toContain('aria-live=');
		expect(first.body).not.toContain('aria-atomic=');
	});

	test('adds assertive alert semantics only when announcement is explicitly requested', () => {
		const { body } = render(FieldError, {
			props: {
				text: 'This value is required.',
				id: 'required-error',
				announce: true
			}
		});

		expect(body).toContain('role="alert"');
		expect(body).toContain('aria-live="assertive"');
		expect(body).toContain('aria-atomic="true"');
	});

	test('omits whitespace-only errors even when announcement is requested', () => {
		const { body } = render(FieldError, {
			props: {
				text: '   ',
				id: 'unused-error',
				announce: true
			}
		});

		expect(body).not.toContain('<p');
		expect(body).not.toContain('unused-error');
		expect(body).not.toContain('role="alert"');
	});

	test('does not rewrite a non-blank consumer-owned ID', () => {
		const { body } = render(FieldError, {
			props: {
				text: 'Error',
				id: '  consumer-error-id  '
			}
		});

		expect(body).toContain(
			'id="  consumer-error-id  "'
		);
	});

	test('composes consumer class and style without creating control semantics', () => {
		const { body } = render(FieldError, {
			props: {
				text: 'Error',
				class: 'consumer-error',
				style: '--giu-field-error-size: 1rem'
			}
		});

		expect(body).toContain('giu-field-error consumer-error');
		expect(body).toContain(
			'style="--giu-field-error-size: 1rem"'
		);
		expect(body).not.toContain('aria-invalid=');
		expect(body).not.toContain('aria-errormessage=');
		expect(body).not.toContain('<input');
	});
});
