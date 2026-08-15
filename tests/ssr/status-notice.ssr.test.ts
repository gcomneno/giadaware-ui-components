import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';

import { StatusNotice } from '../../src/lib/index.js';

import type {
	StatusNoticeAnnouncement,
	StatusNoticeTone
} from '../../src/lib/index.js';

const body = createRawSnippet(() => ({
	render: () => '<p>Body <strong>content</strong></p>'
}));
const icon = createRawSnippet(() => ({
	render: () => '<span data-slot="icon">Decorative icon</span>'
}));
const actions = createRawSnippet(() => ({
	render: () => '<button type="button">Action</button>'
}));

describe('StatusNotice SSR', () => {
	test('produces deterministic static markup by default', () => {
		const props = {
			title: 'Draft saved',
			children: body,
			icon,
			actions
		};
		const first = render(StatusNotice, { props });

		expect(first).toEqual(render(StatusNotice, { props }));
		expect(first.head).toBe('');
		expect(first.body).toContain('<div');
		expect(first.body).toContain('Draft saved');
		expect(first.body).toContain('Body <strong>content</strong>');
		expect(first.body).toContain('data-giu-tone="info"');
		expect(first.body).toContain('giu-status-notice--info');
		expect(first.body).not.toContain('role="status"');
		expect(first.body).not.toContain('role="alert"');
		expect(first.body).not.toContain('aria-live=');
		expect(first.body).not.toContain('aria-atomic=');
	});

	test.each([
		'info',
		'success',
		'warning',
		'error'
	] as const)('renders %s tone as presentation only', (tone) => {
		const { body: markup } = render(StatusNotice, {
			props: { title: `Tone ${tone}`, tone }
		});

		expect(markup).toContain(`data-giu-tone="${tone}"`);
		expect(markup).toContain(`giu-status-notice--${tone}`);
		expect(markup).not.toContain('aria-live=');
	});

	test.each([
		['polite', 'status', 'polite'],
		['assertive', 'alert', 'assertive']
	] as const)(
		'puts %s live-region semantics only on the announcement subregion',
		(announcement, role, ariaLive) => {
			const { body: markup } = render(StatusNotice, {
				props: {
					title: 'Live notice',
					children: body,
					actions,
					onDismiss: vi.fn(),
					closeLabel: 'Dismiss',
					announcement
				}
			});

			expect(markup).toContain(
				`class="giu-status-notice__announcement`
			);
			expect(markup).toContain(`role="${role}"`);
			expect(markup).toContain(`aria-live="${ariaLive}"`);
			expect(markup).toContain('aria-atomic="true"');
			expect(markup.match(/aria-live=/g)).toHaveLength(1);
			expect(markup.match(/aria-atomic=/g)).toHaveLength(1);
			expect(markup.indexOf('role=')).toBeGreaterThan(
				markup.indexOf('giu-status-notice__announcement')
			);
			expect(markup.indexOf('Action')).toBeGreaterThan(
				markup.indexOf('aria-atomic="true"')
			);
			expect(markup.indexOf('Dismiss')).toBeGreaterThan(
				markup.indexOf('aria-atomic="true"')
			);
		}
	);

	test('normalizes invalid runtime tone and announcement values', () => {
		const { body: markup } = render(StatusNotice, {
			props: {
				title: 'Runtime fallback',
				tone: 'neutral' as StatusNoticeTone,
				announcement: 'live' as StatusNoticeAnnouncement
			}
		});

		expect(markup).toContain('data-giu-tone="info"');
		expect(markup).not.toContain('neutral');
		expect(markup).not.toContain('role=');
		expect(markup).not.toContain('aria-live=');
	});

	test('composes id, class, style, icon, actions and controlled dismissal', () => {
		const onDismiss = vi.fn();
		const { body: markup } = render(StatusNotice, {
			props: {
				id: 'publish-notice',
				title: 'Publish queued',
				tone: 'warning',
				children: body,
				icon,
				actions,
				onDismiss,
				closeLabel: '  Dismiss notice  ',
				class: 'consumer-notice',
				style: '--giu-status-notice-padding: 1rem'
			}
		});

		expect(onDismiss).not.toHaveBeenCalled();
		expect(markup).toContain('id="publish-notice"');
		expect(markup).toContain('consumer-notice');
		expect(markup).toContain(
			'style="--giu-status-notice-padding: 1rem"'
		);
		expect(markup).toContain('class="giu-status-notice__icon');
		expect(markup).toContain('aria-hidden="true"');
		expect(markup).toContain('class="giu-status-notice__actions');
		expect(markup).toContain('<button');
		expect(markup).toContain('type="button"');
		expect(markup).toContain('Dismiss notice');
	});

	test('fails closed for blank runtime close labels', () => {
		const onDismiss = vi.fn();
		const { body: markup } = render(StatusNotice, {
			props: {
				title: 'Cannot dismiss',
				onDismiss,
				closeLabel: '   '
			}
		});

		expect(markup).not.toContain('<button');
		expect(markup).not.toContain('Dismiss');
	});

	test('preserves whitespace-only title and body without generating text', () => {
		const whitespace = createRawSnippet(() => ({
			render: () => '   '
		}));
		const { body: markup } = render(StatusNotice, {
			props: {
				title: '   ',
				children: whitespace
			}
		});

		expect(markup).toContain('class="giu-status-notice__title');
		expect(markup).toContain('class="giu-status-notice__body');
		expect(markup).not.toContain('role=');
		expect(markup).not.toContain('Close');
	});
});
