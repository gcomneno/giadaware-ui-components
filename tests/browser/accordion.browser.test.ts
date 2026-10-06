import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import AccordionProbe from '../fixtures/AccordionProbe.svelte';

function summaryOf(
	details: HTMLDetailsElement
): HTMLElement {
	const summary = details.querySelector('summary');

	if (!(summary instanceof HTMLElement)) {
		throw new TypeError(
			'Expected native summary element.'
		);
	}

	return summary;
}

test('single mode keeps only one native disclosure open and synchronizes bindings', async () => {
	const screen = await render(AccordionProbe);

	try {
		const probe = screen.getByTestId(
			'accordion-probe'
		);
		const first = screen.getByTestId(
			'accordion-first'
		).element() as HTMLDetailsElement;
		const second = screen.getByTestId(
			'accordion-second'
		).element() as HTMLDetailsElement;

		const firstSummary = summaryOf(first);
		const secondSummary = summaryOf(second);

		expect(first.name).toBe(
			'faq-accordion-group'
		);
		expect(second.name).toBe(
			'faq-accordion-group'
		);

		firstSummary.click();

		await vi.waitFor(() =>
			expect(first.open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-first-open',
				'true'
			)
		);

		secondSummary.click();

		await vi.waitFor(() =>
			expect(second.open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(first.open).toBe(false)
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-first-open',
				'false'
			)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-second-open',
				'true'
			)
		);
	} finally {
		await screen.unmount();
	}
});

test('multiple mode allows independent open disclosures', async () => {
	const screen = await render(AccordionProbe, {
		multiple: true
	});

	try {
		const probe = screen.getByTestId(
			'accordion-probe'
		);
		const first = screen.getByTestId(
			'accordion-first'
		).element() as HTMLDetailsElement;
		const second = screen.getByTestId(
			'accordion-second'
		).element() as HTMLDetailsElement;

		expect(first.name).toBe('');
		expect(second.name).toBe('');

		summaryOf(first).click();

		await vi.waitFor(() =>
			expect(first.open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-first-open',
				'true'
			)
		);

		summaryOf(second).click();

		await vi.waitFor(() =>
			expect(second.open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-second-open',
				'true'
			)
		);

		expect(first.open).toBe(true);
		expect(second.open).toBe(true);
		expect(probe).toHaveAttribute(
			'data-first-open',
			'true'
		);
	} finally {
		await screen.unmount();
	}
});

test('native summary remains keyboard-operable and retains focus', async () => {
	const screen = await render(AccordionProbe);

	try {
		const first = screen.getByTestId(
			'accordion-first'
		).element() as HTMLDetailsElement;
		const summary = summaryOf(first);

		summary.focus();
		expect(document.activeElement).toBe(summary);

		await userEvent.keyboard('{Enter}');

		await vi.waitFor(() =>
			expect(first.open).toBe(true)
		);

		expect(document.activeElement).toBe(summary);

		await userEvent.keyboard(' ');

		await vi.waitFor(() =>
			expect(first.open).toBe(false)
		);

		expect(document.activeElement).toBe(summary);
	} finally {
		await screen.unmount();
	}
});

test('multiple Accordion instances receive isolated native group names', async () => {
	const first = await render(AccordionProbe, {
		id: 'first-accordion'
	});
	const second = await render(AccordionProbe, {
		id: 'second-accordion'
	});

	try {
		const firstItems = Array.from(
			document.querySelectorAll<HTMLDetailsElement>(
				'#first-accordion details'
			)
		);
		const secondItems = Array.from(
			document.querySelectorAll<HTMLDetailsElement>(
				'#second-accordion details'
			)
		);

		expect(firstItems).toHaveLength(2);
		expect(secondItems).toHaveLength(2);

		expect(
			firstItems.every(
				(item) =>
					item.name ===
					'first-accordion-group'
			)
		).toBe(true);

		expect(
			secondItems.every(
				(item) =>
					item.name ===
					'second-accordion-group'
			)
		).toBe(true);

		summaryOf(firstItems[0]).click();
		summaryOf(secondItems[0]).click();

		await vi.waitFor(() =>
			expect(firstItems[0].open).toBe(true)
		);
		await vi.waitFor(() =>
			expect(secondItems[0].open).toBe(true)
		);
	} finally {
		await first.unmount();
		await second.unmount();
	}
});

test('renders accessible native disclosure semantics with no axe violations', async () => {
	const screen = await render(AccordionProbe);

	try {
		const probe = screen.getByTestId(
			'accordion-probe'
		).element();

		expect(
			(await axe.run(probe)).violations
		).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
