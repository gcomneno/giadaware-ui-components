import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FieldDescriptionErrorProbe from '../fixtures/FieldDescriptionErrorProbe.svelte';

test('keeps field associations consumer-owned and preserves static semantics', async () => {
	const screen = await render(FieldDescriptionErrorProbe);
	const root = screen
		.getByTestId('field-description-error-probe')
		.element() as HTMLElement;

	const email = root.querySelector('#profile-email');
	const emailDescription = root.querySelector(
		'#profile-email-description'
	);
	const accountCode = root.querySelector('#account-code');
	const accountError = root.querySelector('#account-code-error');
	const displayName = root.querySelector('#display-name');

	expect(email).toHaveAttribute(
		'aria-describedby',
		'profile-email-description'
	);
	expect(emailDescription).toHaveClass(
		'giu-field-description',
		'consumer-description'
	);
	expect(emailDescription).toHaveTextContent(
		'Used for account notifications.'
	);
	expect(emailDescription).not.toHaveAttribute('role');
	expect(emailDescription).not.toHaveAttribute('aria-live');

	expect(accountCode).toHaveAttribute('aria-invalid', 'true');
	expect(accountCode).toHaveAttribute(
		'aria-describedby',
		'account-code-error'
	);
	expect(accountCode).not.toHaveAttribute('aria-errormessage');
	expect(accountError).toHaveClass(
		'giu-field-error',
		'consumer-error'
	);
	expect(accountError).not.toHaveAttribute('role');
	expect(accountError).not.toHaveAttribute('aria-live');
	expect(accountError).not.toHaveAttribute('aria-atomic');

	expect(displayName).toHaveAttribute(
		'aria-describedby',
		'display-name-description display-name-error'
	);
	expect(displayName).not.toHaveAttribute('aria-errormessage');

	expect(root.querySelector('#unused-description')).toBeNull();
	expect(root.querySelector('#unused-error')).toBeNull();
});

test('announces only an explicitly live error introduced by the consumer', async () => {
	const screen = await render(FieldDescriptionErrorProbe);
	const root = screen
		.getByTestId('field-description-error-probe')
		.element() as HTMLElement;

	expect(root.querySelector('#dynamic-value-error')).toBeNull();

	await screen
		.getByRole('button', { name: 'Show dynamic error' })
		.click();

	const input = root.querySelector('#dynamic-value');
	const error = root.querySelector('#dynamic-value-error');

	expect(input).toHaveAttribute('aria-invalid', 'true');
	expect(input).toHaveAttribute(
		'aria-errormessage',
		'dynamic-value-error'
	);
	expect(error).toHaveTextContent('This value is required.');
	expect(error).toHaveAttribute('role', 'alert');
	expect(error).toHaveAttribute('aria-live', 'assertive');
	expect(error).toHaveAttribute('aria-atomic', 'true');
});

test('composes neutral styling hooks without owning field layout', async () => {
	const screen = await render(FieldDescriptionErrorProbe);
	const root = screen
		.getByTestId('field-description-error-probe')
		.element() as HTMLElement;

	const description = root.querySelector(
		'.consumer-description'
	);
	const error = root.querySelector('.consumer-error');

	expect(description).toHaveStyle(
		'--giu-field-description-size: 1rem'
	);
	expect(error).toHaveStyle('--giu-field-error-size: 1rem');
});
