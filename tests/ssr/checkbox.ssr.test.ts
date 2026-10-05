import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import { Checkbox } from '../../src/lib/index.js';

describe('Checkbox SSR', () => {
	test('renders deterministic markup for one native checkbox input', () => {
		const first = render(Checkbox, { props: { 'aria-label': 'Accept terms' } });
		expect(first).toEqual(render(Checkbox, { props: { 'aria-label': 'Accept terms' } }));
		expect(first.body.match(/<input/g)).toHaveLength(1);
		expect(first.body).toContain('type="checkbox"');
		expect(first.body).toContain('class="giu-checkbox');
		expect(first.body).toContain('aria-label="Accept terms"');
		expect(first.body).not.toContain('<label');
		expect(first.body).not.toContain('<span');
		expect(first.body).not.toContain('role=');
	});

	test('renders checked and unchecked states natively', () => {
		const checked = render(Checkbox, {
			props: { checked: true, 'aria-label': 'Checked' },
		}).body;
		const unchecked = render(Checkbox, {
			props: { checked: false, 'aria-label': 'Unchecked' },
		}).body;

		expect(checked).toContain('checked=""');
		expect(unchecked).not.toContain('checked=""');
	});

	test('forwards native, form, ARIA, data, class and style attributes without executing handlers', () => {
		const onclick = vi.fn();
		const onchange = vi.fn();
		const onkeydown = vi.fn();
		const { body } = render(Checkbox, { props: {
			checked: true,
			onclick,
			onchange,
			onkeydown,
			disabled: true,
			required: true,
			name: 'terms',
			value: 'accepted',
			form: 'editor',
			autofocus: true,
			'aria-label': 'Accept terms',
			'aria-describedby': 'terms-help',
			'data-consumer': 'yes',
			class: 'consumer-class',
			style: '--giu-checkbox-size: 1.5rem'
		} });

		expect(onclick).not.toHaveBeenCalled();
		expect(onchange).not.toHaveBeenCalled();
		expect(onkeydown).not.toHaveBeenCalled();
		for (const attribute of ['checked', 'disabled', 'required', 'name="terms"', 'value="accepted"', 'form="editor"', 'autofocus', 'aria-label="Accept terms"', 'aria-describedby="terms-help"', 'data-consumer="yes"', 'consumer-class', 'style="--giu-checkbox-size: 1.5rem"']) {
			expect(body).toContain(attribute);
		}
		expect(body).toContain('type="checkbox"');
		expect(body).not.toContain('type="text"');
	});
});
