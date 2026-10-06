import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import AccordionProbe from '../fixtures/AccordionProbe.svelte';

function detailsTags(body: string): string[] {
	return body.match(/<details[^>]*>/g) ?? [];
}

test('renders deterministic single-mode native details grouping', () => {
	const first = render(AccordionProbe);
	const second = render(AccordionProbe);

	expect(first).toEqual(second);

	expect(first.body).toContain(
		'id="faq-accordion"'
	);
	expect(first.body).toContain(
		'data-giu-accordion-mode="single"'
	);

	const details = detailsTags(first.body);

	expect(details).toHaveLength(2);

	for (const tag of details) {
		expect(tag).toContain(
			'name="faq-accordion-group"'
		);
		expect(tag).not.toContain(' open');
	}

	expect(first.body).toContain(
		'<summary class="giu-accordion-item__summary'
	);
});

test('multiple mode omits the native details group name', () => {
	const { body } = render(AccordionProbe, {
		props: {
			multiple: true
		}
	});

	expect(body).toContain(
		'data-giu-accordion-mode="multiple"'
	);

	const details = detailsTags(body);

	expect(details).toHaveLength(2);

	for (const tag of details) {
		expect(tag).not.toContain(' name=');
	}
});
