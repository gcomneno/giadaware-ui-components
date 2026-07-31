import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import { FormActions } from '../../src/lib/studio/index.js';

const plainChildren = createRawSnippet(() => ({
	render: () => '<button type="button">Save</button>'
}));

const arbitraryChildren = createRawSnippet(() => ({
	render: () =>
		'<button type="button" name="intent" value="save">Save</button><a href="/preview">Preview</a><input name="title" value="Draft"><form action="/publish" method="post"><button type="submit">Publish</button></form>'
}));

describe('FormActions SSR', () => {
	test('renders one deterministic native div with the base class and defaults', () => {
		const first = render(FormActions, { props: { children: plainChildren } });

		expect(first).toEqual(render(FormActions, { props: { children: plainChildren } }));
		expect(first.body.match(/<div/g)).toHaveLength(1);
		expect(first.body).toContain('<div class="giu-form-actions');
		expect(first.body).toContain('giu-form-actions--align-start');
		expect(first.body).toContain('giu-form-actions--wrap');
		expect(first.body).not.toContain('role=');
		expect(first.body).not.toContain('aria-');
	});

	test.each([
		['start', 'giu-form-actions--align-start'],
		['center', 'giu-form-actions--align-center'],
		['end', 'giu-form-actions--align-end'],
		['space-between', 'giu-form-actions--align-space-between']
	] as const)('maps %s alignment to its scoped modifier', (align, modifier) => {
		const { body } = render(FormActions, {
			props: { children: plainChildren, align }
		});

		expect(body).toContain(modifier);
	});

	test.each([
		[true, 'giu-form-actions--wrap'],
		[false, 'giu-form-actions--nowrap']
	] as const)('maps wrap=%s to its scoped modifier', (wrap, modifier) => {
		const { body } = render(FormActions, {
			props: { children: plainChildren, wrap }
		});

		expect(body).toContain(modifier);
	});

	test('normalizes invalid runtime alignment to start', () => {
		const { body } = render(FormActions, {
			props: {
				children: plainChildren,
				align: 'distributed' as never
			}
		});

		expect(body).toContain('giu-form-actions--align-start');
		expect(body).not.toContain('giu-form-actions--align-distributed');
	});

	test('composes consumer class and forwards consumer style unchanged', () => {
		const { body } = render(FormActions, {
			props: {
				children: plainChildren,
				class: 'consumer-actions',
				style: '--giu-form-actions-gap: 1rem; color: navy'
			}
		});

		expect(body).toContain('giu-form-actions');
		expect(body).toContain('consumer-actions');
		expect(body).toContain('style="--giu-form-actions-gap: 1rem; color: navy"');
	});

	test('preserves arbitrary consumer controls and form content unchanged', () => {
		const { body } = render(FormActions, { props: { children: arbitraryChildren } });

		expect(body).toContain('<button type="button" name="intent" value="save">Save</button>');
		expect(body).toContain('<a href="/preview">Preview</a>');
		expect(body).toContain('<input name="title" value="Draft">');
		expect(body).toContain('<form action="/publish" method="post"><button type="submit">Publish</button></form>');
	});
});
