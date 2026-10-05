import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import RadioProbe from '../fixtures/RadioProbe.svelte';

test('preserves native radio attributes, classes, styles and bind:group state', async () => {
	const screen = await render(RadioProbe);
	const root = screen.getByTestId('radio-probe');
	const low = screen.getByRole('radio', { name: 'Low importance' });
	const normal = screen.getByRole('radio', { name: 'Normal importance' });
	const high = screen.getByRole('radio', { name: 'High importance' });

	expect(low).toHaveAttribute('type', 'radio');
	expect(low).toHaveAttribute('name', 'importance');
	expect(low).toHaveAttribute('value', 'low');
	expect(low).toHaveAttribute('form', 'external-radio-form');
	expect(low).toHaveAttribute('aria-describedby', 'importance-help');
	expect(low).toHaveAttribute('data-consumer', 'forwarded');
	expect(low).toHaveClass('giu-radio', 'consumer-radio');
	expect(low).toHaveStyle('--giu-radio-size: 1.5rem');

	expect(low).not.toBeChecked();
	expect(normal).toBeChecked();
	expect(high).not.toBeChecked();
	expect(root).toHaveAttribute('data-selected', 'normal');

	await high.click();

	expect(low).not.toBeChecked();
	expect(normal).not.toBeChecked();
	expect(high).toBeChecked();
	await expect.poll(() => root.element().dataset.selected).toBe('high');
});

test('uses native radio keyboard behavior while disabled radios remain inert', async () => {
	const screen = await render(RadioProbe);
	const root = screen.getByTestId('radio-probe');
	const low = screen.getByRole('radio', { name: 'Low importance' });
	const normal = screen.getByRole('radio', { name: 'Normal importance' });
	const disabled = screen.getByRole('radio', { name: 'Disabled preference' });

	(normal.element() as HTMLInputElement).focus();
	await userEvent.keyboard('{ArrowLeft}');

	await vi.waitFor(() => expect(low).toBeChecked());
	await expect.poll(() => root.element().dataset.selected).toBe('low');

	await disabled.click({ force: true });
	expect(disabled).toBeChecked();
	expect(root).toHaveAttribute('data-disabled-count', '0');
});

test('bind:group reflects native changes and native handlers receive events', async () => {
	const screen = await render(RadioProbe);
	const root = screen.getByTestId('radio-probe');
	const low = screen.getByRole('radio', { name: 'Low importance' });
	const high = screen.getByRole('radio', { name: 'High importance' });

	expect(root).toHaveAttribute('data-change-count', '0');

	await low.click();
	await expect.poll(() => root.element().dataset.selected).toBe('low');
	expect(root).toHaveAttribute('data-change-count', '1');

	await high.click();
	await expect.poll(() => root.element().dataset.selected).toBe('high');
	expect(root).toHaveAttribute('data-change-count', '1');
});

test('preserves native same-name FormData with exactly one selected value', async () => {
	const screen = await render(RadioProbe);
	const form = screen.getByTestId('radio-form').element() as HTMLFormElement;
	const low = screen.getByRole('radio', { name: 'Low importance' });
	const high = screen.getByRole('radio', { name: 'High importance' });

	let data = new FormData(form);
	expect(data.get('importance')).toBe('normal');
	expect(data.getAll('importance')).toEqual(['normal']);

	await high.click();
	data = new FormData(form);
	expect(data.get('importance')).toBe('high');
	expect(data.getAll('importance')).toEqual(['high']);

	await low.click();
	data = new FormData(form);
	expect(data.get('importance')).toBe('low');
	expect(data.getAll('importance')).toEqual(['low']);
});
