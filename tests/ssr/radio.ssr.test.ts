import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import { Radio } from '../../src/lib/studio/index.js';

describe('Radio SSR', () => {
	test('renders deterministic markup for one native radio input', () => {
		const props = {
			value: 'normal',
			group: 'normal',
			'aria-label': 'Normal importance'
		};
		const first = render(Radio, { props });

		expect(first).toEqual(render(Radio, { props }));
		expect(first.body.match(/<input/g)).toHaveLength(1);
		expect(first.body).toContain('type="radio"');
		expect(first.body).toContain('class="giu-radio');
		expect(first.body).toContain('value="normal"');
		expect(first.body).toContain('checked=""');
		expect(first.body).toContain('aria-label="Normal importance"');
		expect(first.body).not.toContain('<label');
		expect(first.body).not.toContain('<span');
		expect(first.body).not.toContain('role=');
	});

	test('derives checked state from group and value', () => {
		const selected = render(Radio, {
			props: { group: 'high', value: 'high', 'aria-label': 'Selected' }
		}).body;
		const unselected = render(Radio, {
			props: { group: 'normal', value: 'high', 'aria-label': 'Unselected' }
		}).body;

		expect(selected).toContain('checked=""');
		expect(unselected).not.toContain('checked=""');
	});

	test('forwards native, form, ARIA, data, class and style attributes without executing handlers', () => {
		const onclick = vi.fn();
		const onchange = vi.fn();
		const onkeydown = vi.fn();

		const { body } = render(Radio, {
			props: {
				group: 'normal',
				value: 'normal',
				onclick,
				onchange,
				onkeydown,
				disabled: true,
				required: true,
				name: 'importance',
				form: 'editor',
				autofocus: true,
				'aria-label': 'Normal importance',
				'aria-describedby': 'importance-help',
				'data-consumer': 'yes',
				class: 'consumer-class',
				style: '--giu-radio-size: 1.5rem'
			}
		});

		expect(onclick).not.toHaveBeenCalled();
		expect(onchange).not.toHaveBeenCalled();
		expect(onkeydown).not.toHaveBeenCalled();

		for (const attribute of [
			'checked',
			'disabled',
			'required',
			'name="importance"',
			'value="normal"',
			'form="editor"',
			'autofocus',
			'aria-label="Normal importance"',
			'aria-describedby="importance-help"',
			'data-consumer="yes"',
			'consumer-class',
			'style="--giu-radio-size: 1.5rem"'
		]) {
			expect(body).toContain(attribute);
		}

		expect(body).toContain('type="radio"');
		expect(body).not.toContain('type="text"');
	});
});
