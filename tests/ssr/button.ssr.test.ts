import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import { Button } from '../../src/lib/studio/index.js';

const children = createRawSnippet(() => ({ render: () => 'Save changes' }));

describe('Button SSR', () => {
	test('renders deterministic native button markup with a safe default type', () => {
		const first = render(Button, { props: { children } });
		expect(first).toEqual(render(Button, { props: { children } }));
		expect(first.body).toContain('<button');
		expect(first.body).toContain('type="button"');
		expect(first.body).toContain('data-giu-variant="primary"');
		expect(first.body).toContain('data-giu-size="default"');
		expect(first.body).toContain('Save changes');
	});

	test.each(['button', 'submit', 'reset'] as const)('renders explicit native type %s', (type) => {
		expect(render(Button, { props: { children, type } }).body).toContain(`type="${type}"`);
	});

	test.each(['primary', 'secondary', 'danger'] as const)('renders %s in both sizes', (variant) => {
		for (const size of ['default', 'compact'] as const) {
			const { body } = render(Button, { props: { children, variant, size } });
			expect(body).toContain(`giu-button--${variant}`);
			expect(body).toContain(`giu-button--${size}`);
		}
	});

	test('forwards native, form, ARIA, data, class and style attributes without executing handlers', () => {
		const onclick = vi.fn();
		const { body } = render(Button, { props: {
			children, onclick, disabled: true, name: 'intent', value: 'save', form: 'editor',
			formaction: '/save', formmethod: 'post', formenctype: 'multipart/form-data',
			formnovalidate: true, formtarget: '_self', 'aria-label': 'Save', 'data-consumer': 'yes',
			class: 'consumer-class', style: '--giu-button-background: navy'
		} });
		expect(onclick).not.toHaveBeenCalled();
		for (const attribute of ['disabled', 'name="intent"', 'value="save"', 'form="editor"', 'formaction="/save"', 'formmethod="post"', 'formenctype="multipart/form-data"', 'formnovalidate', 'formtarget="_self"', 'aria-label="Save"', 'data-consumer="yes"', 'consumer-class', 'style="--giu-button-background: navy"']) {
			expect(body).toContain(attribute);
		}
	});

	test('normalizes invalid runtime variant and size values', () => {
		const { body } = render(Button, { props: { children, variant: 'quiet' as never, size: 'large' as never } });
		expect(body).toContain('data-giu-variant="primary"');
		expect(body).toContain('data-giu-size="default"');
		expect(body).not.toContain('quiet');
		expect(body).not.toContain('large');
	});
});
