import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import FormStatus from '../../src/lib/FormStatus.svelte';

afterEach(() => {
	vi.useRealTimers();
});

function statusElement(): HTMLParagraphElement | null {
	return document.querySelector('p[data-tone]');
}

describe('FormStatus browser lifecycle', () => {
	test.each([
		null,
		0,
		-10,
		Number.NaN,
		Number.POSITIVE_INFINITY
	])('keeps duration %s persistent', async (durationMs) => {
		vi.useFakeTimers();

		await render(FormStatus, {
			message: 'Persistent message',
			tone: 'info',
			durationMs
		});

		await vi.advanceTimersByTimeAsync(60_000);

		expect(statusElement()).toHaveTextContent(
			'Persistent message'
		);
	});

	test('dismisses after a positive finite duration', async () => {
		vi.useFakeTimers();

		await render(FormStatus, {
			message: 'Temporary message',
			tone: 'success',
			durationMs: 100
		});

		await vi.advanceTimersByTimeAsync(99);
		expect(statusElement()).toHaveTextContent('Temporary message');

		await vi.advanceTimersByTimeAsync(1);
		expect(statusElement()).toBeNull();
	});

	test('schedules durations above the browser timer limit in safe chunks', async () => {
		vi.useFakeTimers();

		const maximumTimerDelayMs = 2_147_483_647;

		await render(FormStatus, {
			message: 'Very long temporary message',
			tone: 'info',
			durationMs: maximumTimerDelayMs + 100
		});

		await vi.advanceTimersByTimeAsync(maximumTimerDelayMs);

		expect(statusElement()).toHaveTextContent(
			'Very long temporary message'
		);
		expect(vi.getTimerCount()).toBe(1);

		await vi.advanceTimersByTimeAsync(99);
		expect(statusElement()).toHaveTextContent(
			'Very long temporary message'
		);

		await vi.advanceTimersByTimeAsync(1);
		expect(statusElement()).toBeNull();
	});

	test('resets visibility and timing when the message changes', async () => {
		vi.useFakeTimers();

		const screen = await render(FormStatus, {
			message: 'First message',
			tone: 'info',
			durationMs: 100
		});

		await vi.advanceTimersByTimeAsync(60);
		await screen.rerender({
			message: 'Second message',
			tone: 'info',
			durationMs: 100
		});
		await vi.advanceTimersByTimeAsync(60);

		expect(statusElement()).toHaveTextContent('Second message');

		await vi.advanceTimersByTimeAsync(40);
		expect(statusElement()).toBeNull();
	});

	test('resets visibility and timing when duration changes', async () => {
		vi.useFakeTimers();

		const screen = await render(FormStatus, {
			message: 'Duration changed',
			tone: 'warning',
			durationMs: 100
		});

		await vi.advanceTimersByTimeAsync(60);
		await screen.rerender({
			message: 'Duration changed',
			tone: 'warning',
			durationMs: 200
		});
		await vi.advanceTimersByTimeAsync(50);

		expect(statusElement()).toHaveTextContent('Duration changed');

		await vi.advanceTimersByTimeAsync(150);
		expect(statusElement()).toBeNull();
	});

	test('restores a dismissed message when duration becomes persistent', async () => {
		vi.useFakeTimers();

		const screen = await render(FormStatus, {
			message: 'Restored message',
			tone: 'info',
			durationMs: 50
		});

		await vi.advanceTimersByTimeAsync(50);
		expect(statusElement()).toBeNull();

		await screen.rerender({
			message: 'Restored message',
			tone: 'info',
			durationMs: null
		});

		expect(statusElement()).toHaveTextContent('Restored message');
	});

	test('cleans up its timer on unmount', async () => {
		vi.useFakeTimers();
		const timersBeforeRender = vi.getTimerCount();
		const screen = await render(FormStatus, {
			message: 'Unmounted message',
			tone: 'error',
			durationMs: 1_000
		});

		expect(vi.getTimerCount()).toBe(timersBeforeRender + 1);

		await screen.unmount();

		expect(vi.getTimerCount()).toBe(timersBeforeRender);
	});
});
