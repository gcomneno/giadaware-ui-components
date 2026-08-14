import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import { IconButton } from '../../src/lib/studio/index.js';

const icon = createRawSnippet(() => ({
	render: () => '<svg data-icon="edit" aria-label="Ignored geometry"><path d="M1 1h2"></path></svg>'
}));

describe('IconButton SSR', () => {
	test('renders deterministic native button markup with a safe default type and resolved name', () => {
		const props = { label: 'Edit item', icon };
		const first = render(IconButton, { props });
		expect(first).toEqual(render(IconButton, { props }));
		expect(first.body).toContain('<button');
		expect(first.body).toContain('type="button"');
		expect(first.body).toContain('aria-label="Edit item"');
		expect(first.body).toContain('data-giu-variant="primary"');
		expect(first.body).toContain('data-giu-size="default"');
		expect(first.body).toContain('giu-icon-button__icon');
		expect(first.body).toContain('aria-hidden="true"');
	});

	test.each(['button', 'submit', 'reset'] as const)('renders explicit native type %s', (type) => {
		expect(render(IconButton, { props: { label: 'Edit item', icon, type } }).body).toContain(
			`type="${type}"`
		);
	});

	test.each(['primary', 'secondary', 'danger'] as const)('renders %s in both Button sizes', (variant) => {
		for (const size of ['default', 'compact'] as const) {
			const { body } = render(IconButton, {
				props: { label: 'Edit item', icon, variant, size }
			});
			expect(body).toContain(`giu-icon-button--${variant}`);
			expect(body).toContain(`giu-icon-button--${size}`);
		}
	});

	test('trims the consumer label and fails closed for missing or blank runtime labels', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

		try {
			const normalized = render(IconButton, { props: { label: '  Edit item  ', icon } });
			const missing = render(IconButton, {
				props: { label: undefined as never, icon }
			});
			const blank = render(IconButton, { props: { label: '   ', icon } });

			expect(normalized.body).toContain('aria-label="Edit item"');
			expect(normalized.body).not.toContain('aria-label="  Edit item  "');
			expect(missing.body).not.toContain('<button');
			expect(blank.body).not.toContain('<button');
		} finally {
			warn.mockRestore();
		}
	});

	test('keeps the required label authoritative over untyped runtime naming overrides', () => {
		const { body } = render(IconButton, {
			props: {
				label: 'Authoritative label',
				icon,
				'aria-label': 'Runtime override',
				'aria-labelledby': 'runtime-name'
			} as never
		});

		expect(body).toContain('aria-label="Authoritative label"');
		expect(body).not.toContain('aria-label="Runtime override"');
		expect(body).not.toContain('aria-labelledby=');
	});

	test('forwards native ARIA, data, form, class and style attributes without executing handlers', () => {
		const onclick = vi.fn();
		const { body } = render(IconButton, {
			props: {
				label: 'Edit item',
				icon,
				onclick,
				disabled: true,
				name: 'intent',
				value: 'edit',
				form: 'editor',
				'aria-describedby': 'edit-help',
				'aria-pressed': false,
				'data-consumer': 'yes',
				class: 'consumer-class',
				style: '--giu-icon-button-background: navy'
			}
		});

		expect(onclick).not.toHaveBeenCalled();
		for (const attribute of [
			'disabled',
			'name="intent"',
			'value="edit"',
			'form="editor"',
			'aria-describedby="edit-help"',
			'aria-pressed="false"',
			'data-consumer="yes"',
			'consumer-class',
			'style="--giu-icon-button-background: navy"'
		]) {
			expect(body).toContain(attribute);
		}
	});

	test('normalizes invalid runtime variant and size values through the Button contract', () => {
		const { body } = render(IconButton, {
			props: {
				label: 'Edit item',
				icon,
				variant: 'quiet' as never,
				size: 'large' as never
			}
		});

		expect(body).toContain('data-giu-variant="primary"');
		expect(body).toContain('data-giu-size="default"');
		expect(body).not.toContain('quiet');
		expect(body).not.toContain('large');
	});
});
