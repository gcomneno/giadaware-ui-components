import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';

import { FormStatus } from '../../src/lib/index.js';

import type { FormStatusTone } from '../../src/lib/index.js';

describe('FormStatus SSR', () => {
	test('produces deterministic persistent markup without timers or browser globals', () => {
		const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

		try {
			const props = {
				message: 'Impostazioni salvate',
				tone: 'success' as const
			};
			const first = render(FormStatus, { props });
			const second = render(FormStatus, { props });

			expect(first).toEqual(second);
			expect(first.body).toContain('Impostazioni salvate');
			expect(first.body).toContain('role="status"');
			expect(first.body).toContain('aria-live="polite"');
			expect(first.body).toContain('aria-atomic="true"');
			expect(first.head).toBe('');
			expect(setTimeoutSpy).not.toHaveBeenCalled();
		} finally {
			setTimeoutSpy.mockRestore();
		}
	});

	test.each([
		['success', 'status', 'polite'],
		['error', 'alert', 'assertive'],
		['warning', 'status', 'polite'],
		['info', 'status', 'polite']
	] as const)(
		'renders deterministic semantics for the %s tone',
		(tone, role, ariaLive) => {
			const result = render(FormStatus, {
				props: { message: `Tone: ${tone}`, tone }
			});

			expect(result.body).toContain(`data-tone="${tone}"`);
			expect(result.body).toContain(`role="${role}"`);
			expect(result.body).toContain(`aria-live="${ariaLive}"`);
		}
	);

	test('defaults to the persistent info policy', () => {
		const result = render(FormStatus, {
			props: { message: 'Informazione' }
		});

		expect(result.body).toContain('data-tone="info"');
		expect(result.body).toContain('role="status"');
		expect(result.body).toContain('aria-live="polite"');
	});

	test('preserves the consumer message and approved class and style attributes', () => {
		const message = 'Riga uno\nRiga due';
		const result = render(FormStatus, {
			props: {
				message,
				tone: 'warning',
				class: 'settings-status',
				style: '--giu-form-status-padding: 1rem'
			}
		});

		expect(result.body).toContain(message);
		expect(result.body).toContain('settings-status');
		expect(result.body).toContain(
			'style="--giu-form-status-padding: 1rem"'
		);
		expect(result.body).not.toContain('Chiudi');
		expect(result.body).not.toContain('<button');
	});

	test('renders nothing for an empty message', () => {
		const result = render(FormStatus, {
			props: {
				message: '',
				tone: 'info',
				durationMs: 100
			}
		});

		expect(result.body).not.toContain('<p');
	});

	test('normalizes an invalid runtime tone to info', () => {
		const result = render(FormStatus, {
			props: {
				message: 'Runtime fallback',
				tone: 'neutral' as FormStatusTone
			}
		});

		expect(result.body).toContain('data-tone="info"');
		expect(result.body).toContain('role="status"');
		expect(result.body).not.toContain('neutral');
	});

	test('keeps the public tone type usable from the root entry', () => {
		const tone: FormStatusTone = 'error';

		expect(tone).toBe('error');
	});
});
