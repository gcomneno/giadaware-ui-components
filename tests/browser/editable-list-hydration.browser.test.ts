import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	EDITABLE_LIST_DRAG_HYDRATION_SSR_BODY,
	EDITABLE_LIST_HYDRATION_SSR_BODY
} from '../fixtures/editable-list-hydration-contract.js';
import EditableListDragHydrationProbe from '../fixtures/EditableListDragHydrationProbe.svelte';
import EditableListHydrationProbe from '../fixtures/EditableListHydrationProbe.svelte';

function dispatchPointer(
	target: Element,
	type: 'pointerdown' | 'pointermove' | 'pointerup',
	init: PointerEventInit = {}
): PointerEvent {
	const event = new PointerEvent(type, {
		bubbles: true,
		cancelable: true,
		pointerId: 1,
		pointerType: 'mouse',
		isPrimary: true,
		button: 0,
		clientX: 0,
		clientY: 0,
		...init
	});
	target.dispatchEvent(event);
	return event;
}

test('hydrates editable-list primitives without replacement or mismatch', async () => {
	const container = document.createElement('div');
	container.innerHTML = EDITABLE_LIST_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="editable-list-hydration-probe"]');
	const serverFieldset = container.querySelector('fieldset');
	const serverList = container.querySelector('ol');
	const serverRows = [...container.querySelectorAll('ol > li')];
	const serverButtons = [...container.querySelectorAll('button')];
	const serverDescription = container.querySelector(
		'#hero-image-reorder-context'
	);

	if (
		!(serverRoot instanceof HTMLElement) ||
		!(serverFieldset instanceof HTMLFieldSetElement) ||
		!(serverList instanceof HTMLOListElement) ||
		!(serverDescription instanceof HTMLElement) ||
		serverRows.length !== 1 ||
		serverButtons.length !== 2
	) {
		throw new TypeError('Server EditableList hydration content missing');
	}

	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(EditableListHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(container.querySelector('[data-testid="editable-list-hydration-probe"]')).toBe(serverRoot);
		expect(container.querySelector('fieldset')).toBe(serverFieldset);
		expect(container.querySelector('ol')).toBe(serverList);
		expect([...container.querySelectorAll('ol > li')]).toEqual(serverRows);
		expect([...container.querySelectorAll('button')]).toEqual(serverButtons);
		expect(container.querySelector('#hero-image-reorder-context')).toBe(serverDescription);
		expect(serverFieldset.querySelector('legend')).toHaveTextContent('Gallery');
		expect(serverDescription).toHaveTextContent('Hero image, position 1 of 3');
		expect(serverDescription).not.toHaveAttribute('aria-live');
		expect(serverButtons[0]).toHaveAccessibleName('Move hero image up');
		expect(serverButtons[0]).toHaveAttribute('aria-describedby', 'hero-image-reorder-context');
		expect(serverButtons[0]).toBeDisabled();
		expect(serverButtons[1]).toHaveAccessibleName('Move hero image down');
		expect(serverButtons[1]).toHaveAttribute('aria-describedby', 'hero-image-reorder-context');
		expect(serverButtons[1]).not.toBeDisabled();

		serverButtons[1].click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-move-count', '1')
		);
		expect(serverDescription).toHaveTextContent('Hero image, position 2 of 3');
		expect(serverDescription).toHaveAttribute('id', 'hero-image-reorder-context');

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) {
			await unmount(component);
		}

		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});

test('hydrates EditableListRow drag handles without replacement or eager callbacks', async () => {
	const container = document.createElement('div');
	container.innerHTML = EDITABLE_LIST_DRAG_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="editable-list-drag-hydration-probe"]');
	const serverRows = [...container.querySelectorAll('ol > li')];
	const serverHandle = container.querySelector('[data-giu-drag-handle]');
	const serverButtons = [...container.querySelectorAll('button')];

	if (
		!(serverRoot instanceof HTMLElement) ||
		serverRows.length !== 2 ||
		!serverRows.every((row) => row instanceof HTMLLIElement) ||
		!(serverHandle instanceof HTMLButtonElement) ||
		serverButtons.length !== 4
	) {
		throw new TypeError('Server EditableList drag hydration content missing');
	}

	Object.defineProperties(serverHandle, {
		setPointerCapture: { configurable: true, value: vi.fn() },
		hasPointerCapture: { configurable: true, value: vi.fn(() => true) },
		releasePointerCapture: { configurable: true, value: vi.fn() }
	});

	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(EditableListDragHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(container.querySelector('[data-testid="editable-list-drag-hydration-probe"]')).toBe(serverRoot);
		expect([...container.querySelectorAll('ol > li')]).toEqual(serverRows);
		expect(container.querySelector('[data-giu-drag-handle]')).toBe(serverHandle);
		expect([...container.querySelectorAll('button')]).toEqual(serverButtons);
		expect(serverRoot).toHaveAttribute('data-started', '0');
		expect(serverRoot).toHaveAttribute('data-dropped', '0');
		expect(serverRows[0]).not.toHaveAttribute('data-giu-dragging');
		expect(serverRows[0]).not.toHaveAttribute('data-giu-drop-candidate');
		expect(serverRows[1]).not.toHaveAttribute('data-giu-drop-candidate');
		expect(serverHandle).toHaveAccessibleName('Drag hero image');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		serverButtons[2].click();
		await tick();
		expect(serverRows[0]).not.toHaveAttribute('data-giu-drop-candidate');
		expect(serverRows[1]).toHaveAttribute('data-giu-drop-candidate', 'after');

		dispatchPointer(serverHandle, 'pointerdown');
		dispatchPointer(serverHandle, 'pointermove', { clientX: 8 });
		dispatchPointer(serverHandle, 'pointerup', { clientX: 8 });

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-dropped', '1')
		);
		expect(serverRoot).toHaveAttribute('data-started', '1');
		expect(document.activeElement).not.toBe(serverHandle);
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) {
			await unmount(component);
		}

		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
