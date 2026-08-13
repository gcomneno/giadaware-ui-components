import { createRawSnippet } from 'svelte';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Panel from '../../src/lib/studio/Panel.svelte';
import PanelProbe from '../fixtures/PanelProbe.svelte';

test('renders semantic panels and preserves consumer-owned behavior', async () => {
	await render(PanelProbe);

	const root = document.querySelector('[data-testid="panel-probe"]');
	if (!(root instanceof HTMLElement)) {
		throw new TypeError('Panel probe missing');
	}

	const sections = [...root.querySelectorAll<HTMLElement>('section')];

	expect(sections).toHaveLength(7);
	expect(sections[0].querySelector('h2')).toHaveTextContent('Default panel');
	expect(sections[0]).toHaveAttribute(
		'aria-labelledby',
		sections[0].querySelector('h2')?.id,
	);

	const complete = document.querySelector('#complete-panel');
	if (!(complete instanceof HTMLElement)) {
		throw new TypeError('Complete panel missing');
	}

	expect(complete).toHaveClass('giu-panel');
	expect(complete).toHaveClass('consumer-panel');
	expect(complete).toHaveStyle('max-width: 30rem');
	expect(complete).toHaveAttribute('aria-labelledby', 'complete-panel-title');
	expect(complete.querySelector('h3')).toHaveTextContent('Complete panel');
	expect(complete.querySelector('[role]')).toBeNull();
	expect(complete.querySelector('[aria-live]')).toBeNull();

	const header = complete.querySelector('.giu-panel__header');
	const description = complete.querySelector(
		'[data-testid="panel-description"]',
	);
	const action = complete.querySelector('[data-testid="panel-action"]');
	const body = complete.querySelector('[data-testid="panel-body"]');
	const footer = complete.querySelector('.giu-panel__footer');
	const footerAction = complete.querySelector(
		'[data-testid="panel-footer-action"]',
	);

	if (
		!(header instanceof HTMLElement) ||
		!(description instanceof HTMLElement) ||
		!(action instanceof HTMLButtonElement) ||
		!(body instanceof HTMLFormElement) ||
		!(footer instanceof HTMLElement) ||
		!(footerAction instanceof HTMLButtonElement)
	) {
		throw new TypeError('Complete panel content missing');
	}

	expect(
		header.compareDocumentPosition(description) &
			Node.DOCUMENT_POSITION_CONTAINED_BY,
	).toBeTruthy();
	expect(
		description.compareDocumentPosition(action) &
			Node.DOCUMENT_POSITION_FOLLOWING,
	).toBeTruthy();
	expect(
		action.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING,
	).toBeTruthy();
	expect(
		body.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
	).toBeTruthy();
	expect(footer.querySelector('[role]')).toBeNull();
	expect(footer.querySelector('[aria-live]')).toBeNull();
	expect(getComputedStyle(footer).minWidth).toBe('0px');

	complete.style.width = '10rem';

	expect(complete).toHaveStyle('width: 10rem');
	expect(footer.getBoundingClientRect().width).toBeLessThanOrEqual(
		complete.getBoundingClientRect().width,
	);

	action.click();
	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-action-count', '1'),
	);

	body.requestSubmit();
	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-action-count', '2'),
	);

	footerAction.click();
	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-action-count', '3'),
	);

	for (const level of [2, 3, 4, 5, 6]) {
		expect(
			[...sections].some(
				(section) =>
					section.querySelector(`h${level}`)?.textContent === `Level ${level}`,
			),
		).toBe(true);
	}
});

test('normalizes invalid runtime heading levels and forwards class and style', async () => {
	const children = createRawSnippet(() => ({
		render: () => '<p>Normalized body</p>',
	}));

	const screen = await render(Panel, {
		title: 'Normalized panel',
		children,
		headingLevel: 1 as never,
		class: 'normalized-panel',
		style: 'max-width: 20rem',
	});

	const panel = screen.container.querySelector('section');

	expect(panel).toHaveClass('normalized-panel');
	expect(panel).toHaveStyle('max-width: 20rem');
	expect(panel?.querySelector('h2')).toHaveTextContent('Normalized panel');
});
