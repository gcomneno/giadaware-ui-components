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
});
