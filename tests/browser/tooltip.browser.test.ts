import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import TooltipProbe from '../fixtures/TooltipProbe.svelte';

function dispatchPointer(
	element: Element,
	type: 'pointerenter' | 'pointerleave',
	relatedTarget: EventTarget | null = null
) {
	element.dispatchEvent(
		new PointerEvent(type, {
			bubbles: false,
			cancelable: true,
			relatedTarget
		})
	);
}

test('focus shows the tooltip and blur hides it while consumer handlers compose once', async () => {
	const screen = await render(TooltipProbe);

	try {
		const probe = screen.getByTestId('tooltip-probe');
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		expect(tooltip).not.toBeNull();

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		expect(tooltip.hidden).toBe(true);

		trigger.focus();

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);
		expect(probe).toHaveAttribute(
			'data-focus-count',
			'1'
		);

		trigger.blur();

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(true)
		);
		expect(probe).toHaveAttribute(
			'data-blur-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('pointer enter shows and pointer leave hides with consumer composition exactly once', async () => {
	const screen = await render(TooltipProbe);

	try {
		const probe = screen.getByTestId('tooltip-probe');
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		expect(tooltip).not.toBeNull();

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		dispatchPointer(trigger, 'pointerenter');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);
		expect(probe).toHaveAttribute(
			'data-pointer-enter-count',
			'1'
		);

		dispatchPointer(trigger, 'pointerleave');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(true)
		);
		expect(probe).toHaveAttribute(
			'data-pointer-leave-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('Escape hides an open tooltip without preventing consumer keydown composition', async () => {
	const screen = await render(TooltipProbe);

	try {
		const probe = screen.getByTestId('tooltip-probe');
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		expect(tooltip).not.toBeNull();

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		trigger.focus();

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);

		trigger.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true
			})
		);

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(true)
		);

		expect(probe).toHaveAttribute(
			'data-keydown-count',
			'1'
		);
	} finally {
		await screen.unmount();
	}
});

test('unrelated keys do not hide the tooltip', async () => {
	const screen = await render(TooltipProbe);

	try {
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		expect(tooltip).not.toBeNull();

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		trigger.focus();

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);

		trigger.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true
			})
		);

		expect(tooltip.hidden).toBe(false);
	} finally {
		await screen.unmount();
	}
});

test('multiple Tooltip instances have isolated relationships', async () => {
	const first = await render(TooltipProbe, {
		id: 'first-tooltip',
		label: 'First help'
	});
	const second = await render(TooltipProbe, {
		id: 'second-tooltip',
		label: 'Second help'
	});

	try {
		const firstTrigger = document.querySelector(
			'button[aria-describedby="first-tooltip"]'
		) as HTMLButtonElement | null;
		const secondTrigger = document.querySelector(
			'button[aria-describedby="second-tooltip"]'
		) as HTMLButtonElement | null;

		const firstTooltip = document.getElementById(
			'first-tooltip'
		) as HTMLDivElement | null;
		const secondTooltip = document.getElementById(
			'second-tooltip'
		) as HTMLDivElement | null;

		expect(firstTrigger).not.toBeNull();
		expect(secondTrigger).not.toBeNull();
		expect(firstTooltip).not.toBeNull();
		expect(secondTooltip).not.toBeNull();

		if (
			!firstTrigger ||
			!secondTrigger ||
			!firstTooltip ||
			!secondTooltip
		) {
			throw new TypeError(
				'Expected both Tooltip instances.'
			);
		}

		firstTrigger.focus();

		await vi.waitFor(() =>
			expect(firstTooltip.hidden).toBe(false)
		);

		expect(secondTooltip.hidden).toBe(true);
		expect(
			firstTrigger.getAttribute('aria-describedby')
		).toBe('first-tooltip');
		expect(
			secondTrigger.getAttribute('aria-describedby')
		).toBe('second-tooltip');
	} finally {
		await first.unmount();
		await second.unmount();
	}
});

test('renders an accessible tooltip pattern with no axe violations', async () => {
	const screen = await render(TooltipProbe);

	try {
		const probe = screen.getByTestId(
			'tooltip-probe'
		).element();

		expect((await axe.run(probe)).violations).toHaveLength(
			0
		);
	} finally {
		await screen.unmount();
	}
});


test('focus and hover ownership compose instead of hiding each other', async () => {
	const screen = await render(TooltipProbe);

	try {
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		trigger.focus();
		dispatchPointer(trigger, 'pointerenter');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);

		dispatchPointer(trigger, 'pointerleave');

		expect(tooltip.hidden).toBe(false);

		trigger.blur();

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(true)
		);
	} finally {
		await screen.unmount();
	}
});

test('pointer can move from trigger onto tooltip content without dismissing it', async () => {
	const screen = await render(TooltipProbe);

	try {
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		dispatchPointer(trigger, 'pointerenter');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);

		dispatchPointer(
			trigger,
			'pointerleave',
			tooltip
		);
		dispatchPointer(
			tooltip,
			'pointerenter',
			trigger
		);

		expect(tooltip.hidden).toBe(false);

		dispatchPointer(tooltip, 'pointerleave');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(true)
		);
	} finally {
		await screen.unmount();
	}
});

test('Escape dismisses a hover-only tooltip until hover fully ends', async () => {
	const screen = await render(TooltipProbe);

	try {
		const trigger = screen.getByTestId(
			'tooltip-trigger'
		).element() as HTMLButtonElement;
		const tooltip = document.getElementById(
			trigger.getAttribute('aria-describedby') ?? ''
		) as HTMLDivElement | null;

		if (!tooltip) {
			throw new TypeError('Expected tooltip.');
		}

		dispatchPointer(trigger, 'pointerenter');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);

		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true
			})
		);

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(true)
		);

		dispatchPointer(trigger, 'pointerleave');
		dispatchPointer(trigger, 'pointerenter');

		await vi.waitFor(() =>
			expect(tooltip.hidden).toBe(false)
		);
	} finally {
		await screen.unmount();
	}
});
