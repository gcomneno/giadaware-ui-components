import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import StatusNoticeProbe from '../fixtures/StatusNoticeProbe.svelte';

test('keeps live-region content separate from actions and dismissal controls', async () => {
	const screen = await render(StatusNoticeProbe);
	const root = screen.getByTestId('status-notice-probe');
	const notice = document.querySelector('#publish-status');
	const announcement = notice?.querySelector(
		'.giu-status-notice__announcement'
	);
	const actions = notice?.querySelector('.giu-status-notice__actions');
	const dismiss = screen.getByRole('button', {
		name: 'Dismiss notice'
	});

	expect(notice).toBeInstanceOf(HTMLElement);
	expect(notice).toHaveClass(
		'giu-status-notice',
		'giu-status-notice--warning',
		'consumer-notice'
	);
	expect(notice).toHaveStyle('--giu-status-notice-gap: 1rem');
	expect(notice).toHaveAttribute('data-giu-tone', 'warning');
	expect(notice).not.toHaveAttribute('role');
	expect(notice).not.toHaveAttribute('aria-live');
	expect(announcement).toBeInstanceOf(HTMLElement);
	expect(announcement).toHaveAttribute('role', 'status');
	expect(announcement).toHaveAttribute('aria-live', 'polite');
	expect(announcement).toHaveAttribute('aria-atomic', 'true');
	expect(announcement).toHaveTextContent('Publish queued');
	expect(announcement).toHaveTextContent(
		'Use the published URL after the cache refresh completes.'
	);
	expect(announcement).not.toHaveTextContent('Preview');
	expect(announcement).not.toHaveTextContent('Retry');
	expect(announcement).not.toHaveTextContent('Dismiss notice');
	expect(actions).toBeInstanceOf(HTMLElement);
	expect(actions).toHaveTextContent('Preview');
	expect(actions).toHaveTextContent('Retry');
	expect(
		notice?.querySelector('.giu-status-notice__icon')
	).toHaveAttribute('aria-hidden', 'true');

	await dismiss.click();
	expect(root).toHaveAttribute('data-dismiss-count', '1');
	expect(document.querySelector('#publish-status')).toBe(notice);

	(dismiss.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');
	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-dismiss-count', '2')
	);
	expect(document.querySelector('#publish-status')).toBe(notice);
});
