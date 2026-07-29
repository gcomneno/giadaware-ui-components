import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FormActionsProbe from '../fixtures/FormActionsProbe.svelte';

test('renders the fixed div, defaults, alignments, wrapping, and consumer styling', async () => {
	const screen = await render(FormActionsProbe);
	const root = screen.getByTestId('form-actions-probe').element() as HTMLElement;
	const actions = [...root.querySelectorAll(':scope > .giu-form-actions')] as HTMLDivElement[];

	expect(actions).toHaveLength(6);
	expect(actions.every((element) => element.tagName === 'DIV')).toBe(true);
	expect(actions[0]).toHaveClass(
		'giu-form-actions',
		'giu-form-actions--align-start',
		'giu-form-actions--wrap',
		'consumer-actions'
	);
	expect(actions[1]).toHaveClass('giu-form-actions--align-center', 'giu-form-actions--wrap');
	expect(actions[2]).toHaveClass('giu-form-actions--align-end', 'giu-form-actions--wrap');
	expect(actions[3]).toHaveClass('giu-form-actions--align-space-between', 'giu-form-actions--wrap');
	expect(actions[4]).toHaveClass('giu-form-actions--align-start', 'giu-form-actions--nowrap');
	expect(actions[5]).toHaveClass('giu-form-actions--align-start');
	expect(actions[0]).toHaveAttribute('style', '--giu-form-actions-gap: 20px;');
});

test('applies the documented flex layout, alignment, wrapping, and custom gap', async () => {
	const screen = await render(FormActionsProbe);
	const root = screen.getByTestId('form-actions-probe').element() as HTMLElement;
	const actions = [...root.querySelectorAll(':scope > .giu-form-actions')] as HTMLDivElement[];
	const styles = actions.map((element) => getComputedStyle(element));

	expect(styles[0].display).toBe('flex');
	expect(styles[0].flexDirection).toBe('row');
	expect(styles[0].alignItems).toBe('center');
	expect(styles[0].justifyContent).toBe('flex-start');
	expect(styles[0].flexWrap).toBe('wrap');
	expect(styles[0].gap).toBe('20px');
	expect(Number.parseFloat(styles[1].gap)).toBeCloseTo(
		Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.75
	);
	expect(styles[1].justifyContent).toBe('center');
	expect(styles[2].justifyContent).toBe('flex-end');
	expect(styles[3].justifyContent).toBe('space-between');
	expect(styles[4].flexWrap).toBe('nowrap');
});

test('preserves arbitrary child elements, native attributes, and consumer handlers', async () => {
	const screen = await render(FormActionsProbe);
	const root = screen.getByTestId('form-actions-probe');
	const nativeRoot = root.element() as HTMLElement;
	const button = screen.getByRole('button', { name: 'Save' });
	const link = screen.getByRole('link', { name: 'Preview' });
	const input = screen.getByRole('textbox', { name: 'Title' });
	const form = nativeRoot.querySelector('form') as HTMLFormElement;

	expect(button).toHaveAttribute('type', 'button');
	expect(button).toHaveAttribute('name', 'intent');
	expect(button).toHaveAttribute('value', 'save');
	expect(link).toHaveAttribute('href', '/preview');
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noreferrer');
	expect(input).toHaveAttribute('name', 'title');
	expect(input).toHaveValue('Draft');
	expect(form).toHaveAttribute('action', '/publish');
	expect(form).toHaveAttribute('method', 'post');

	await button.click();
	expect(root).toHaveAttribute('data-action-count', '1');

	(button.element() as HTMLButtonElement).focus();
	expect(document.activeElement).toBe(button.element());
	await button.element().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	expect(root).toHaveAttribute('data-key-count', '1');

	await input.fill('Updated');
	expect(Number(nativeRoot.dataset.inputCount)).toBeGreaterThan(0);

	form.requestSubmit();
	await vi.waitFor(() => expect(root).toHaveAttribute('data-submit-count', '1'));
});

test('does not add component policy or component-created controls', async () => {
	const screen = await render(FormActionsProbe);
	const root = screen.getByTestId('form-actions-probe').element() as HTMLElement;
	const actions = [...root.querySelectorAll(':scope > .giu-form-actions')];

	for (const action of actions) {
		expect(action.matches('[role], [aria-live], [aria-atomic], [aria-label]')).toBe(false);
	}

	expect(root.querySelectorAll('button')).toHaveLength(2);
	expect(root.querySelectorAll('a')).toHaveLength(1);
	expect(root.querySelectorAll('input')).toHaveLength(1);
	expect(root.querySelectorAll('form')).toHaveLength(1);
});
