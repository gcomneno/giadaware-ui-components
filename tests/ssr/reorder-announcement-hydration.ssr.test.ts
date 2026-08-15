import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import { REORDER_ANNOUNCEMENT_HYDRATION_SSR_BODY } from '../fixtures/reorder-announcement-hydration-contract.js';
import ReorderAnnouncementHydrationProbe from '../fixtures/ReorderAnnouncementHydrationProbe.svelte';

test('produces deterministic ReorderAnnouncement hydration markup without stale text', () => {
	const first = render(ReorderAnnouncementHydrationProbe);

	expect(first).toEqual(render(ReorderAnnouncementHydrationProbe));
	expect(first.body).toBe(REORDER_ANNOUNCEMENT_HYDRATION_SSR_BODY);
	expect(first.body.match(/role="status"/g)).toHaveLength(1);
	expect(first.body).toContain('aria-live="polite"');
	expect(first.body).toContain('aria-atomic="true"');
	expect(first.body).not.toContain('Stale server result');
});
