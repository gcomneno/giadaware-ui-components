import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import { AsyncOperationPanel } from '../../src/lib/studio/index.js';

const action = createRawSnippet(() => ({ render: () => '<button type="submit">Run</button>' }));

describe('AsyncOperationPanel SSR', () => {
	test.each([
		['idle', undefined, undefined], ['running', 'info', 'Working'], ['success', 'success', 'success message'],
		['warning', 'warning', 'warning message'], ['error', 'error', 'error message']
	] as const)('renders deterministic %s state', (state, tone, text) => {
		const props = state === 'idle' ? { state, title: 'Title', action } : state === 'running'
			? { state, title: 'Title', action, busyLabel: 'Working' }
			: { state, title: 'Title', action, message: `${state} message` };
		const first = render(AsyncOperationPanel, { props });
		expect(first).toEqual(render(AsyncOperationPanel, { props }));
		expect(first.body).toContain(`data-state="${state}"`);
		expect(first.body).toContain('<button type="submit">Run</button>');
		if (tone) expect(first.body).toContain(`data-tone="${tone}"`);
		else expect(first.body).not.toContain('aria-live');
		if (text) expect(first.body).toContain(text);
		if (state === 'running') expect(first.body).toContain('aria-busy="true"');
	});

	test('renders optional snippets and escaped technical text without executing the consumer action', () => {
		const submitted = vi.fn();
		const inertAction = createRawSnippet(() => ({ render: () => '<form><button type="submit">Action</button></form>' }));
		const description = createRawSnippet(() => ({ render: () => '<p>Description</p>' }));
		const result = createRawSnippet(() => ({ render: () => '<a href="/result">Result</a>' }));
		const { body } = render(AsyncOperationPanel, { props: { state: 'success', title: 'Build', action: inertAction, message: 'Done', description, result, technicalDetails: '<script>x</script>', technicalDetailsLabel: 'Output' } });
		expect(submitted).not.toHaveBeenCalled();
		expect(body).toContain('<p>Description</p>');
		expect(body).toContain('<a href="/result">Result</a>');
		expect(body).toContain('&lt;script>x&lt;/script>');
		expect(body).not.toContain('<script>x</script>');
	});

	test.each([
		['absent', undefined, undefined],
		['null', null, undefined],
		['non-object', 5, undefined],
		['indeterminate', { mode: 'indeterminate', label: 'Upload progress', value: 50, max: 100 }, 'indeterminate'],
		['determinate', { mode: 'determinate', label: 'Upload progress', value: 2.5, max: 10 }, 'determinate'],
		['blank label', { mode: 'determinate', label: '   ', value: 2, max: 10 }, undefined],
		['invalid mode', { mode: 'pending', label: 'Upload progress', value: 2, max: 10 }, undefined],
		['non-finite value', { mode: 'determinate', label: 'Upload progress', value: Number.NaN, max: 10 }, 'indeterminate'],
		['non-finite max', { mode: 'determinate', label: 'Upload progress', value: 2, max: Number.POSITIVE_INFINITY }, 'indeterminate'],
		['non-positive max', { mode: 'determinate', label: 'Upload progress', value: 2, max: 0 }, 'indeterminate'],
		['negative value', { mode: 'determinate', label: 'Upload progress', value: -2, max: 10 }, 'determinate'],
		['excess value', { mode: 'determinate', label: 'Upload progress', value: 12, max: 10 }, 'determinate']
	] as const)('normalizes %s progress during SSR', (_name, progress, expectedMode) => {
		const { body } = render(AsyncOperationPanel, {
			props: {
				state: 'running',
				title: 'Upload',
				action,
				busyLabel: 'Uploading',
				progress
			} as never
		});

		if (expectedMode === undefined) {
			expect(body).not.toContain('async-operation-panel__progress');
			expect(body).not.toContain('<progress');
			return;
		}

		expect(body).toContain(`data-giu-progress="${expectedMode}"`);
		expect(body).toContain('aria-label="Upload progress"');
		expect(body).toContain('<progress');
		expect(body).not.toContain('role="progressbar"');
		expect(body).not.toContain('aria-valuenow');
		expect(body).not.toContain('aria-valuemax');
		expect(body).not.toContain('aria-valuetext');

		if (expectedMode === 'indeterminate') {
			expect(body).not.toContain('value=');
			expect(body).not.toContain('max=');
			return;
		}

		if (_name === 'negative value') {
			expect(body).toContain('value="0"');
		} else if (_name === 'excess value') {
			expect(body).toContain('value="10"');
		} else {
			expect(body).toContain('value="2.5"');
		}
		expect(body).toContain('max="10"');
	});

	test('ignores runtime progress outside running state', () => {
		for (const state of ['idle', 'success', 'warning', 'error'] as const) {
			const props = state === 'idle'
				? { state, title: 'Title', action, progress: { mode: 'indeterminate', label: 'Ignored' } }
				: { state, title: 'Title', action, message: 'Done', progress: { mode: 'indeterminate', label: 'Ignored' } };

			const { body } = render(AsyncOperationPanel, { props: props as never });
			expect(body).not.toContain('async-operation-panel__progress');
			expect(body).not.toContain('<progress');
		}
	});
});
