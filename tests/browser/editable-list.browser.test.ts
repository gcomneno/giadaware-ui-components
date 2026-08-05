import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import EditableListProbe from '../fixtures/EditableListProbe.svelte';
import EditableListStateProbe from '../fixtures/EditableListStateProbe.svelte';

test('uses native list semantics and invokes only enabled reorder callbacks without submitting the form', async () => {
	const screen = await render(EditableListProbe);
	const form = screen.getByTestId('editable-list-probe');
	const fieldset = form.element().querySelector('fieldset') as HTMLFieldSetElement;
	expect(fieldset.querySelector('legend')?.textContent).toBe('Gallery images');
	expect(fieldset.querySelectorAll('ol > li')).toHaveLength(2);
	expect(fieldset.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
	const up = screen.getByRole('button', { name: 'Move second image up' });
	const down = screen.getByRole('button', { name: 'Move first image down' });
	const disabledUp = screen.getByRole('button', { name: 'Move first image up' });
	const disabledDown = screen.getByRole('button', { name: 'Move second image down' });
	expect(disabledUp).toBeDisabled();
	expect(disabledDown).toBeDisabled();
	(disabledUp.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	(disabledDown.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	expect(form).toHaveAttribute('data-up', '0');
	expect(form).toHaveAttribute('data-down', '0');
	await up.click();

	(down.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');

	expect(form).toHaveAttribute('data-up', '1');
	expect(form).toHaveAttribute('data-down', '1');
	expect(form).toHaveAttribute('data-submitted', '0');
	expect(document.activeElement).toBe(down.element());

	(up.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Space}');

	expect(form).toHaveAttribute('data-up', '2');
	expect(form).toHaveAttribute('data-down', '1');
	expect(form).toHaveAttribute('data-submitted', '0');
	expect(document.activeElement).toBe(up.element());
});

test('uses the consumer-owned isEmpty condition for a real empty each body', async () => {
	const screen = await render(EditableListStateProbe);
	const form = screen.getByTestId('editable-list-state-probe').element();

	expect(screen.getByText('No images yet.')).toBeInTheDocument();
	expect(form.querySelector('ol')).toBeNull();

	await screen.getByRole('button', { name: 'Add image' }).click();

	expect(form.textContent).not.toContain('No images yet.');
	expect(screen.getByRole('list')).toBeInTheDocument();
	expect(screen.getByRole('listitem')).toHaveTextContent('Hero image');

	const singleRowUp = screen.getByRole('button', { name: 'Move image up' });
	const singleRowDown = screen.getByRole('button', { name: 'Move image down' });

	expect(singleRowUp).toBeDisabled();
	expect(singleRowDown).toBeDisabled();

	(singleRowUp.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	(singleRowDown.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);

	expect(form).toHaveAttribute('data-move-count', '0');

	await screen.getByRole('button', { name: 'Remove image' }).click();

	expect(screen.getByText('No images yet.')).toBeInTheDocument();
	expect(form.querySelector('ol')).toBeNull();
});
