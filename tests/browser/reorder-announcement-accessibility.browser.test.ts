import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ReorderAnnouncementConsumerProbe from '../fixtures/ReorderAnnouncementConsumerProbe.svelte';

test('has one polite live region beside non-live visible feedback and remains visually hidden', async () => {
	const screen = await render(ReorderAnnouncementConsumerProbe);
	const root = screen.getByTestId('reorder-announcement-consumer-probe').element();
	const liveRegions = root.querySelectorAll('[aria-live]');
	const liveRegion = root.querySelector('.giu-reorder-announcement');
	const visibleConfirmation = screen.getByTestId('visible-confirmation').element();

	expect(liveRegions).toHaveLength(1);
	expect(liveRegion).toBeInstanceOf(HTMLElement);
	expect(liveRegion).toHaveAttribute('role', 'status');
	expect(liveRegion).toHaveAttribute('aria-live', 'polite');
	expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
	expect(visibleConfirmation).not.toHaveAttribute('aria-live');
	expect(visibleConfirmation).not.toHaveAttribute('role');

	const styles = getComputedStyle(liveRegion as HTMLElement);
	expect(styles.position).toBe('absolute');
	expect(styles.overflow).toBe('hidden');
	expect(styles.clipPath).toBe('inset(50%)');

	expect((await axe.run(root)).violations).toHaveLength(0);
});
