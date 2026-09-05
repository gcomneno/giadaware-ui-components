import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ImageFocalPointControl from '../../src/lib/studio/ImageFocalPointControl.svelte';
import ImageFocalPointControlMultipleProbe from '../fixtures/ImageFocalPointControlMultipleProbe.svelte';

import type { ImageFocalPointValue } from '../../src/lib/studio/image-focal-point-control.js';

const image = {
	src: '/focal.jpg',
	alt: 'Focal image'
};
const baseProps = {
	image,
	label: 'Choose focal point'
};

function surface(id?: string): HTMLButtonElement {
	const element = id
		? document.getElementById(id)
		: document.querySelector('button');

	if (!(element instanceof HTMLButtonElement)) {
		throw new TypeError('The focal-point surface was not rendered.');
	}

	return element;
}

function marker(root: ParentNode = document): HTMLElement {
	const element = root.querySelector('.giu-image-focal-point-control__marker');

	if (!(element instanceof HTMLElement)) {
		throw new TypeError('The focal-point marker was not rendered.');
	}

	return element;
}

function setRect(
	element: HTMLElement,
	rect: { left: number; top: number; width: number; height: number }
): void {
	Object.defineProperty(element, 'getBoundingClientRect', {
		configurable: true,
		value: () => ({
			...rect,
			x: rect.left,
			y: rect.top,
			right: rect.left + rect.width,
			bottom: rect.top + rect.height,
			toJSON: () => {}
		})
	});
}

function pointer(
	element: HTMLElement,
	type: 'pointerdown' | 'pointermove' | 'pointerup',
	options: Partial<PointerEventInit> = {}
): PointerEvent {
	const event = new PointerEvent(type, {
		bubbles: true,
		cancelable: true,
		pointerId: 7,
		pointerType: 'mouse',
		isPrimary: true,
		button: 0,
		...options
	});
	element.dispatchEvent(event);
	return event;
}

function key(element: HTMLElement, keyName: string, shiftKey = false): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key: keyName,
		shiftKey,
		bubbles: true,
		cancelable: true
	});
	element.dispatchEvent(event);
	return event;
}

function expectMarkerPosition(element: HTMLElement, left: string, top: string): void {
	expect(element.style.left).toBe(left);
	expect(element.style.top).toBe(top);
}

async function controlled(
	options: Record<string, unknown> = {}
) {
	let value: ImageFocalPointValue | null =
		(options.value as ImageFocalPointValue | null | undefined) ?? {
			x: 0.5,
			y: 0.5
		};
	const calls: ImageFocalPointValue[] = [];
	let screen: Awaited<ReturnType<typeof render>>;
	const onvaluechange = (next: ImageFocalPointValue) => {
		calls.push(next);
		value = next;
		void screen.rerender({ ...baseProps, ...options, value, onvaluechange });
	};

	screen = await render(ImageFocalPointControl, {
		...baseProps,
		...options,
		value,
		onvaluechange
	});

	return { screen, calls, value: () => value };
}

describe('ImageFocalPointControl browser behavior', () => {
	test('renders the normalized marker position from controlled value', async () => {
		await controlled({ value: { x: 0.7, y: 0.2 } });

		expect(document.querySelector('[data-giu-focal-x]')).toHaveAttribute('data-giu-focal-x', '0.7000');
		expect(document.querySelector('[data-giu-focal-y]')).toHaveAttribute('data-giu-focal-y', '0.2000');
		expectMarkerPosition(marker(), '70%', '20%');
	});

	test('positions from pointer down using the current preview bounds', async () => {
		const harness = await controlled();
		const control = surface();
		setRect(control, { left: 20, top: 10, width: 200, height: 100 });

		pointer(control, 'pointerdown', { clientX: 170, clientY: 60 });

		await vi.waitFor(() => expect(harness.calls).toEqual([{ x: 0.75, y: 0.5 }]));
		expect(harness.value()).toEqual({ x: 0.75, y: 0.5 });
	});

	test('drags through pointer capture and updates from the active preview bounds', async () => {
		const harness = await controlled();
		const control = surface();
		setRect(control, { left: 0, top: 0, width: 200, height: 100 });

		pointer(control, 'pointerdown', { clientX: 20, clientY: 10 });
		pointer(control, 'pointermove', { clientX: 180, clientY: 75 });
		pointer(control, 'pointerup', { clientX: 180, clientY: 75 });

		await vi.waitFor(() => expect(harness.calls.at(-1)).toEqual({ x: 0.9, y: 0.75 }));
		expect(harness.calls).toEqual([
			{ x: 0.1, y: 0.1 },
			{ x: 0.9, y: 0.75 }
		]);
	});

	test('uses the current bounding box after the preview resizes during drag', async () => {
		const harness = await controlled();
		const control = surface();
		let width = 200;
		setRect(control, { left: 0, top: 0, width, height: 100 });

		pointer(control, 'pointerdown', { clientX: 100, clientY: 50 });
		expect(harness.calls).toEqual([]);

		width = 400;
		setRect(control, { left: 0, top: 0, width, height: 100 });
		pointer(control, 'pointermove', { clientX: 100, clientY: 50 });

		await vi.waitFor(() => expect(harness.calls).toEqual([{ x: 0.25, y: 0.5 }]));
	});

	test('clamps pointer positions outside the preview bounds', async () => {
		const harness = await controlled();
		const control = surface();
		setRect(control, { left: 10, top: 20, width: 100, height: 100 });

		pointer(control, 'pointerdown', { clientX: -40, clientY: 180 });

		await vi.waitFor(() => expect(harness.calls).toEqual([{ x: 0, y: 1 }]));
	});

	test('moves by Arrow keys and clamps keyboard results', async () => {
		const harness = await controlled({ value: { x: 0.5, y: 0.5 } });
		const control = surface();

		expect(key(control, 'ArrowRight').defaultPrevented).toBe(true);
		await vi.waitFor(() => expect(harness.calls.at(-1)).toEqual({ x: 0.51, y: 0.5 }));

		key(control, 'ArrowUp');
		await vi.waitFor(() => expect(harness.calls.at(-1)).toEqual({ x: 0.51, y: 0.49 }));

		const callCountBeforeBoundaryNoop = harness.calls.length;
		await harness.screen.rerender({
			...baseProps,
			value: { x: 0, y: 1 },
			onvaluechange: harness.calls.push.bind(harness.calls)
		});
		key(control, 'ArrowLeft');
		expect(harness.calls).toHaveLength(callCountBeforeBoundaryNoop);
	});

	test('moves by larger Shift Arrow steps', async () => {
		const harness = await controlled({ value: { x: 0.5, y: 0.5 } });

		key(surface(), 'ArrowDown', true);

		await vi.waitFor(() => expect(harness.calls).toEqual([{ x: 0.5, y: 0.6 }]));
	});

	test('disabled state blocks pointer and keyboard changes', async () => {
		const harness = await controlled({ disabled: true });
		const control = surface();
		setRect(control, { left: 0, top: 0, width: 100, height: 100 });

		pointer(control, 'pointerdown', { clientX: 90, clientY: 90 });
		key(control, 'ArrowRight');

		expect(control).toBeDisabled();
		expect(harness.calls).toHaveLength(0);
	});

	test('controlled value remains authoritative when the consumer rejects a transition', async () => {
		const onvaluechange = vi.fn();
		await render(ImageFocalPointControl, {
			...baseProps,
			value: { x: 0.2, y: 0.2 },
			onvaluechange
		});
		const control = surface();
		setRect(control, { left: 0, top: 0, width: 100, height: 100 });

		pointer(control, 'pointerdown', { clientX: 90, clientY: 80 });

		await vi.waitFor(() => expect(onvaluechange).toHaveBeenCalledWith({ x: 0.9, y: 0.8 }));
		expectMarkerPosition(marker(), '20%', '20%');
	});

	test('keeps multiple instances isolated', async () => {
		await render(ImageFocalPointControlMultipleProbe);
		const first = surface('first-focal');
		const second = surface('second-focal');
		setRect(first, { left: 0, top: 0, width: 100, height: 100 });
		setRect(second, { left: 0, top: 0, width: 100, height: 100 });

		pointer(first, 'pointerdown', { pointerId: 1, clientX: 80, clientY: 20 });
		pointer(second, 'pointerdown', { pointerId: 2, clientX: 10, clientY: 90 });

		const root = document.querySelector('[data-testid="image-focal-point-control-multiple-probe"]');
		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-first-count', '1');
			expect(root).toHaveAttribute('data-second-count', '1');
		});
		expect(first.closest('[data-giu-focal-x]')).toHaveAttribute('data-giu-focal-x', '0.8000');
		expect(second.closest('[data-giu-focal-x]')).toHaveAttribute('data-giu-focal-x', '0.1000');
	});
});
