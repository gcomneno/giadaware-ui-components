import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CheckboxProbe from '../fixtures/CheckboxProbe.svelte';

test('preserves native checkbox attributes, classes, styles and independent instances', async () => {
	const screen = await render(CheckboxProbe);
	const root = screen.getByTestId('checkbox-probe');
	const accept = screen.getByRole('checkbox', { name: 'Accept terms' });
	const newsletter = screen.getByRole('checkbox', { name: 'Receive newsletter' });

	expect(accept).toHaveAttribute('type', 'checkbox');
	expect(accept).toHaveAttribute('name', 'terms');
	expect(accept).toHaveAttribute('value', 'accepted');
	expect(accept).toHaveAttribute('form', 'external-checkbox-form');
	expect(accept).toHaveAttribute('aria-describedby', 'terms-help');
	expect(accept).toHaveAttribute('data-consumer', 'forwarded');
	expect(accept).toHaveClass('giu-checkbox', 'consumer-checkbox');
	expect(accept).toHaveStyle('--giu-checkbox-size: 1.5rem');
	expect(accept).toBeChecked();
	expect(newsletter).not.toBeChecked();
	expect(root).toHaveAttribute('data-accepted', 'true');
	expect(root).toHaveAttribute('data-newsletter', 'false');

	await newsletter.click();
	expect(newsletter).toBeChecked();
	expect(root).toHaveAttribute('data-accepted', 'true');
	expect(root).toHaveAttribute('data-newsletter', 'true');
});

test('toggles through pointer and Space while disabled checkboxes do not toggle', async () => {
	const screen = await render(CheckboxProbe);
	const accept = screen.getByRole('checkbox', { name: 'Accept terms' });
	const disabled = screen.getByRole('checkbox', { name: 'Disabled preference' });
	const root = screen.getByTestId('checkbox-probe');

	await accept.click();
	expect(accept).not.toBeChecked();
	expect(root).toHaveAttribute('data-accepted', 'false');

	(accept.element() as HTMLInputElement).focus();
	await userEvent.keyboard('{Space}');
	await vi.waitFor(() => expect(accept).toBeChecked());
	expect(root).toHaveAttribute('data-accepted', 'true');

	await disabled.click({ force: true });
	expect(disabled).toBeChecked();
	expect(root).toHaveAttribute('data-disabled-count', '0');
});

test('bind:checked reflects native changes and native handlers receive events', async () => {
	const screen = await render(CheckboxProbe);
	const accept = screen.getByRole('checkbox', { name: 'Accept terms' });
	const root = screen.getByTestId('checkbox-probe');

	expect(root).toHaveAttribute('data-change-count', '0');
	await accept.click();
	expect(root).toHaveAttribute('data-accepted', 'false');
	expect(root).toHaveAttribute('data-change-count', '1');
	await accept.click();
	expect(root).toHaveAttribute('data-accepted', 'true');
	expect(root).toHaveAttribute('data-change-count', '2');
});

test('preserves native FormData for checked, unchecked and same-name groups', async () => {
	const screen = await render(CheckboxProbe);
	const form = screen.getByTestId('checkbox-form').element() as HTMLFormElement;
	const accept = screen.getByRole('checkbox', { name: 'Accept terms' });
	const newsletter = screen.getByRole('checkbox', { name: 'Receive newsletter' });
	const design = screen.getByRole('checkbox', { name: 'Design topic' });
	const accessibility = screen.getByRole('checkbox', { name: 'Accessibility topic' });

	let data = new FormData(form);
	expect(data.get('terms')).toBe('accepted');
	expect(data.has('newsletter')).toBe(false);
	expect(data.getAll('topics')).toEqual(['design']);

	await accept.click();
	await newsletter.click();
	await accessibility.click();
	data = new FormData(form);
	expect(data.has('terms')).toBe(false);
	expect(data.get('newsletter')).toBe('yes');
	expect(data.getAll('topics')).toEqual(['design', 'accessibility']);
});
