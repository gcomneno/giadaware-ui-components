import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ButtonProbe from '../fixtures/ButtonProbe.svelte';

test('preserves pointer, keyboard, disabled and forwarded native behavior', async () => {
	const screen = await render(ButtonProbe);
	const root = screen.getByTestId('button-probe');
	const save = screen.getByRole('button', { name: 'Save changes' });
	expect(save).toHaveAttribute('type', 'button');
	expect(save).toHaveAttribute('name', 'intent');
	expect(save).toHaveAttribute('value', 'save');
	expect(save).toHaveAttribute('aria-describedby', 'button-help');
	expect(save).toHaveAttribute('data-consumer', 'forwarded');
	expect(save).toHaveClass('giu-button', 'consumer-class');
	expect(save).toHaveStyle('width: 100%');
	expect(save).toHaveStyle('--giu-button-border-radius: 1rem');

	const saveElement = save.element() as HTMLButtonElement;
	const leading = saveElement.querySelector('.giu-button__leading');
	const label = saveElement.querySelector('.giu-button__label');
	const trailing = saveElement.querySelector('.giu-button__trailing');

	if (
		!(leading instanceof HTMLElement) ||
		!(label instanceof HTMLElement) ||
		!(trailing instanceof HTMLElement)
	) {
		throw new TypeError('Button composition regions missing');
	}

	expect(leading).toHaveAttribute('aria-hidden', 'true');
	expect(trailing).toHaveAttribute('aria-hidden', 'true');
	expect(label).toHaveTextContent('Save changes');
	expect(save).not.toHaveAttribute('aria-busy');

	await save.click();
	expect(root).toHaveAttribute('data-count', '1');
	(save.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');
	await vi.waitFor(() => expect(root).toHaveAttribute('data-count', '2'));
	await screen.getByRole('button', { name: 'Disabled action' }).click({ force: true });
	expect(root).toHaveAttribute('data-count', '2');
});

test('reactively normalizes controlled variant and size props', async () => {
	const screen = await render(ButtonProbe);
	const save = screen.getByRole('button', { name: 'Save changes' });
	expect(save).toHaveAttribute('data-giu-variant', 'primary');
	expect(save).toHaveAttribute('data-giu-size', 'default');
	await screen.getByRole('button', { name: 'Change presentation' }).click();
	expect(save).toHaveAttribute('data-giu-variant', 'secondary');
	expect(save).toHaveAttribute('data-giu-size', 'compact');
});

test('keeps compact and long-label buttons usable in a narrow container', async () => {
	const screen = await render(ButtonProbe);
	const compact = screen.getByRole('button', { name: 'Remove item' }).element() as HTMLButtonElement;
	const longLabel = screen.getByRole('button', { name: /deliberately long/ }).element() as HTMLButtonElement;
	const longLabelContent = longLabel.querySelector('.giu-button__label');
	const longLeading = longLabel.querySelector('.giu-button__leading');
	const longTrailing = longLabel.querySelector('.giu-button__trailing');

	if (
		!(longLabelContent instanceof HTMLElement) ||
		!(longLeading instanceof HTMLElement) ||
		!(longTrailing instanceof HTMLElement)
	) {
		throw new TypeError('Long-label Button composition regions missing');
	}

	expect(compact.getBoundingClientRect().height).toBeGreaterThanOrEqual(40);
	expect(longLabel.scrollWidth).toBeLessThanOrEqual(longLabel.clientWidth);
	expect(longLabelContent.scrollWidth).toBeLessThanOrEqual(longLabelContent.clientWidth);
	expect(longLabel.getBoundingClientRect().width).toBeLessThanOrEqual(192);
	expect(getComputedStyle(longLeading).flexShrink).toBe('0');
	expect(getComputedStyle(longTrailing).flexShrink).toBe('0');
});
