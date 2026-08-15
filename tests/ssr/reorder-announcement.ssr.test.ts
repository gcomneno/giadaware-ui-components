import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

import { ReorderAnnouncement } from '../../src/lib/studio/index.js';

describe('ReorderAnnouncement SSR', () => {
	test('renders one deterministic empty polite live-region shell', () => {
		const props = {
			message: 'Moved image to position 2',
			eventKey: 'confirmed-reorder-1',
			class: 'consumer-announcement',
			style: '--giu-reorder-announcement-size: 2px'
		};
		const first = render(ReorderAnnouncement, { props });
		const second = render(ReorderAnnouncement, { props });

		expect(first).toEqual(second);
		expect(first.body.match(/role="status"/g)).toHaveLength(1);
		expect(first.body.match(/aria-live="polite"/g)).toHaveLength(1);
		expect(first.body.match(/aria-atomic="true"/g)).toHaveLength(1);
		expect(first.body).toContain('class="giu-reorder-announcement');
		expect(first.body).toContain('consumer-announcement');
		expect(first.body).toContain('style="--giu-reorder-announcement-size: 2px"');
		expect(first.body).not.toContain('Moved image to position 2');
		expect(first.body).toMatch(/<div[^>]*><\/div>/);
	});

	test('fails closed for null events and blank or null messages on the server', () => {
		const nullEvent = render(ReorderAnnouncement, {
			props: { message: 'Moved image', eventKey: null }
		});
		const blankMessage = render(ReorderAnnouncement, {
			props: { message: '   ', eventKey: 1 }
		});
		const nullMessage = render(ReorderAnnouncement, {
			props: { message: null, eventKey: 2 }
		});

		expect(nullEvent.body).not.toContain('Moved image');
		expect(blankMessage.body).not.toContain('   ');
		expect(nullMessage.body).not.toContain('null');
	});
});
