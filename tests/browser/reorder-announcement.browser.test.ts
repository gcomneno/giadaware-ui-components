import { tick } from 'svelte';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import { ReorderAnnouncement } from '../../src/lib/studio/index.js';
import ReorderAnnouncementConsumerProbe from '../fixtures/ReorderAnnouncementConsumerProbe.svelte';

test('announces only confirmed consumer-owned reorder outcomes', async () => {
	const screen = await render(ReorderAnnouncementConsumerProbe);
	const root = screen.getByTestId('reorder-announcement-consumer-probe');
	const liveRegion = root.element().querySelector('.giu-reorder-announcement');
	const heroPositionContext = root.element().querySelector('#hero-reorder-context');
	const disabledUp = screen.getByRole('button', { name: 'Move Hero image up' });
	const moveDown = screen.getByRole('button', { name: 'Move Hero image down' });

	expect(liveRegion).toBeInstanceOf(HTMLElement);
	expect(heroPositionContext).toHaveTextContent('Hero image, position 1 of 2');
	expect(liveRegion).toHaveTextContent('');
	expect(document.activeElement).toBe(document.body);

	(disabledUp.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	await tick();
	await tick();
	expect(root).toHaveAttribute('data-failed-count', '0');
	expect(liveRegion).toHaveTextContent('');

	(moveDown.element() as HTMLButtonElement).focus();
	await moveDown.click();
	expect(root).toHaveAttribute('data-confirmed-count', '1');
	expect(heroPositionContext).toHaveTextContent('Hero image, position 2 of 2');
	expect(moveDown).toHaveAttribute('aria-describedby', 'hero-reorder-context');
	await vi.waitFor(() =>
		expect(liveRegion).toHaveTextContent('Image moved')
	);
});

test('reannounces identical messages for distinct event keys and prevents stale rapid writes', async () => {
	const screen = await render(ReorderAnnouncementConsumerProbe);
	const root = screen.getByTestId('reorder-announcement-consumer-probe');
	const liveRegion = root.element().querySelector('.giu-reorder-announcement');
	const observedText: string[] = [];
	const observer = new MutationObserver(() => {
		observedText.push(liveRegion?.textContent ?? '');
	});

	if (!liveRegion) {
		throw new TypeError('ReorderAnnouncement live region missing');
	}

	observer.observe(liveRegion, {
		childList: true,
		characterData: true,
		subtree: true
	});

	await screen.getByRole('button', { name: 'Move Hero image down' }).click();
	await vi.waitFor(() =>
		expect(liveRegion).toHaveTextContent('Image moved')
	);
	observedText.length = 0;

	await screen.getByRole('button', { name: 'Move Hero image up' }).click();
	await vi.waitFor(() =>
		expect(liveRegion).toHaveTextContent('Image moved')
	);
	expect(observedText).toContain('');
	expect(observedText).toContain('Image moved');

	const rapidButton = screen.getByRole('button', { name: 'Rapid confirmed moves' });
	(rapidButton.element() as HTMLButtonElement).focus();
	await rapidButton.click();
	await tick();
	await tick();
	expect(liveRegion).toHaveTextContent('Newest move');
	expect(liveRegion).not.toHaveTextContent('Older move');
	expect(document.activeElement).toBe(rapidButton.element());
	observer.disconnect();
});

test('clears when the current event becomes null or has blank content', async () => {
	const screen = await render(ReorderAnnouncement, {
		message: null,
		eventKey: null
	});
	const liveRegion = document.querySelector('.giu-reorder-announcement');

	await screen.rerender({
		message: 'Moved image',
		eventKey: 1
	});
	await vi.waitFor(() =>
		expect(liveRegion).toHaveTextContent('Moved image')
	);

	await screen.rerender({
		message: '   ',
		eventKey: 2
	});
	await tick();
	expect(liveRegion?.textContent).toBe('');

	await screen.rerender({
		message: 'Moved image again',
		eventKey: 3
	});
	await vi.waitFor(() =>
		expect(liveRegion).toHaveTextContent('Moved image again')
	);

	await screen.rerender({
		message: 'Moved image again',
		eventKey: null
	});
	await tick();
	expect(liveRegion?.textContent).toBe('');
});
