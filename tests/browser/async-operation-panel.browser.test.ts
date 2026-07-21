import { createRawSnippet } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import AsyncOperationPanel from '../../src/lib/studio/AsyncOperationPanel.svelte';
import AsyncOperationPanelProbe from '../fixtures/AsyncOperationPanelProbe.svelte';
import TwoPanelProbe from '../fixtures/AsyncOperationPanelTwoPanelProbe.svelte';

test('renders all states, maps tones, and owns only action presentation', async () => {
	await render(AsyncOperationPanelProbe);
	const root = document.querySelector('[data-testid="async-operation-panel-probe"]');
	if (!(root instanceof HTMLElement)) throw new TypeError('Probe missing');
	const panels = [...root.querySelectorAll<HTMLElement>('[data-state]')];
	expect(panels.map((panel) => panel.dataset.state)).toEqual(['idle', 'running', 'success', 'warning', 'error', 'success']);
	expect(panels[0].querySelector('[role]')).toBeNull();
	expect(panels[1]).toHaveAttribute('aria-busy', 'true');
	expect(panels[1].querySelector('button')).toBeDisabled();
	expect(panels[1].querySelector('[role="status"]')).toHaveAttribute('data-tone', 'info');
	expect(panels[2].querySelector('[role="status"]')).toHaveAttribute('data-tone', 'success');
	expect(panels[3].querySelector('[role="status"]')).toHaveAttribute('data-tone', 'warning');
	expect(panels[4].querySelector('[role="alert"]')).toHaveAttribute('data-tone', 'error');
	expect(root.querySelectorAll('details')).toHaveLength(1);
	expect(root.querySelector('summary')).toHaveTextContent('Technical output');
	expect(root.querySelector('.async-operation-panel__details-content')).toHaveTextContent('<script>raw output</script>');
	expect(root.querySelector('a')).toHaveTextContent('View result');

	const idleAction = panels[0].querySelector('button');
	if (!(idleAction instanceof HTMLButtonElement)) throw new TypeError('Action missing');
	idleAction.click();
	await vi.waitFor(() => expect(root).toHaveAttribute('data-action-count', '1'));
	const disclosure = root.querySelector('details');
	const summary = root.querySelector('summary');
	if (!(disclosure instanceof HTMLDetailsElement) || !(summary instanceof HTMLElement)) throw new TypeError('Disclosure missing');
	expect(disclosure.open).toBe(false);
	summary.click();
	await vi.waitFor(() => expect(disclosure.open).toBe(true));
	summary.focus();
	await userEvent.keyboard('{Enter}');
	await vi.waitFor(() => expect(disclosure.open).toBe(false));
});

test('consumer controls focus, independent results, and mutual exclusion across two panels', async () => {
	const screen = await render(TwoPanelProbe);
	const first = screen.getByTestId('first-action');
	const second = screen.getByTestId('second-action');
	const focusAnchor = document.querySelector('[data-testid="finish-first"]') as HTMLButtonElement;
	focusAnchor.focus();
	(document.querySelector('[data-testid="first-action"]') as HTMLButtonElement).click();
	await vi.waitFor(() => expect(first).toBeDisabled());
	expect(focusAnchor).toHaveFocus();
	expect(first).toBeDisabled();
	expect(second).toBeDisabled();
	await screen.getByTestId('finish-first').click();
	expect(screen.getByTestId('first-result')).toHaveTextContent('First content');
	expect(document.querySelector('[data-testid="second-result"]')).toBeNull();
	expect(second).toBeEnabled();
	await second.click();
	expect(first).toBeDisabled();
	expect(second).toBeDisabled();
	await screen.getByTestId('finish-second').click();
	expect(screen.getByTestId('first-result')).toHaveTextContent('First content');
	expect(screen.getByTestId('second-result')).toHaveTextContent('Second content');
});

test('normalizes invalid runtime state and forwards class/style', async () => {
	const action = vi.fn();
	const actionSnippet = createRawSnippet(() => ({ render: () => '<button>Run normalized</button>' }));
	const screen = await render(AsyncOperationPanel, {
		state: 'complete' as never,
		title: 'Normalized',
		action: actionSnippet,
		headingLevel: 1 as never,
		class: 'consumer-class',
		style: 'max-width: 20rem'
	});
	const panel = screen.container.querySelector('[data-state]');
	expect(panel).toHaveAttribute('data-state', 'idle');
	expect(panel).toHaveClass('consumer-class');
	expect(panel).toHaveStyle('max-width: 20rem');
	expect(panel?.querySelector('h2')).toHaveTextContent('Normalized');
	expect(action).not.toHaveBeenCalled();
});
