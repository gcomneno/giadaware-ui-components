import { createRawSnippet } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import IconButton from '../../src/lib/studio/IconButton.svelte';
import IconButtonProbe from '../fixtures/IconButtonProbe.svelte';

test('preserves pointer, keyboard, disabled and forwarded native behavior', async () => {
	const screen = await render(IconButtonProbe);
	const root = screen.getByTestId('icon-button-probe');
	const edit = screen.getByRole('button', { name: 'Edit item' });

	expect(edit).toHaveAttribute('type', 'button');
	expect(edit).toHaveAttribute('name', 'intent');
	expect(edit).toHaveAttribute('value', 'edit');
	expect(edit).toHaveAttribute('aria-describedby', 'icon-button-help');
	expect(edit).toHaveAttribute('aria-pressed', 'false');
	expect(edit).toHaveAttribute('data-consumer', 'forwarded');
	expect(edit).toHaveClass('giu-icon-button', 'consumer-class');
	expect(edit).toHaveStyle('--giu-icon-button-border-radius: 1rem');

	const icon = edit.element().querySelector('.giu-icon-button__icon');
	if (!(icon instanceof HTMLElement)) {
		throw new TypeError('IconButton decorative icon wrapper missing');
	}

	expect(icon).toHaveAttribute('aria-hidden', 'true');

	await edit.click();
	expect(root).toHaveAttribute('data-count', '1');

	(edit.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');
	await vi.waitFor(() => expect(root).toHaveAttribute('data-count', '2'));

	await screen.getByRole('button', { name: 'Unavailable action' }).click({ force: true });
	expect(root).toHaveAttribute('data-count', '2');
});

test('keeps the required label authoritative over untyped runtime naming overrides', async () => {
	const runtimeIcon = createRawSnippet(() => ({
		render: () => '<span>Runtime icon</span>'
	}));

	const screen = await render(IconButton, {
		label: 'Authoritative label',
		icon: runtimeIcon,
		'aria-label': 'Runtime override',
		'aria-labelledby': 'runtime-name'
	} as never);

	const button = screen.getByRole('button', {
		name: 'Authoritative label'
	});

	expect(button).toHaveAttribute('aria-label', 'Authoritative label');
	expect(button).not.toHaveAttribute('aria-labelledby');
});

test('reactively normalizes presentation using the Button variant and size contract', async () => {
	const screen = await render(IconButtonProbe);
	const edit = screen.getByRole('button', { name: 'Edit item' });

	expect(edit).toHaveAttribute('data-giu-variant', 'primary');
	expect(edit).toHaveAttribute('data-giu-size', 'default');

	await screen.getByRole('button', { name: 'Change presentation' }).click();

	expect(edit).toHaveAttribute('data-giu-variant', 'secondary');
	expect(edit).toHaveAttribute('data-giu-size', 'compact');
});

test('provides documented default and compact pointer targets', async () => {
	const screen = await render(IconButtonProbe);
	const edit = screen.getByRole('button', { name: 'Edit item' }).element() as HTMLButtonElement;
	const compact = screen.getByRole('button', { name: 'Remove item' }).element() as HTMLButtonElement;

	expect(edit.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
	expect(edit.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
	expect(compact.getBoundingClientRect().width).toBeGreaterThanOrEqual(40);
	expect(compact.getBoundingClientRect().height).toBeGreaterThanOrEqual(40);
});
