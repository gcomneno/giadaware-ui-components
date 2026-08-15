import { createRawSnippet, tick } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import EditableListProbe from '../fixtures/EditableListProbe.svelte';
import EditableListDragProbe from '../fixtures/EditableListDragProbe.svelte';
import EditableListStateProbe from '../fixtures/EditableListStateProbe.svelte';
import ReorderActionsPositionContextProbe from '../fixtures/ReorderActionsPositionContextProbe.svelte';
import { EditableListRow } from '../../src/lib/studio/index.js';
import type { EditableListRowDrag } from '../../src/lib/studio/index.js';

const rowFields = createRawSnippet(() => ({ render: () => '<span>Hero image</span>' }));

function dispatchPointer(
	target: Element,
	type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'lostpointercapture',
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

function dragHandle(root: ParentNode = document): HTMLButtonElement {
	const handle = root.querySelector('[data-giu-drag-handle]');

	if (!(handle instanceof HTMLButtonElement)) {
		throw new TypeError('EditableListRow drag handle missing');
	}

	return handle;
}

function stubPointerCapture(handle: HTMLButtonElement, capture: () => void = () => undefined): void {
	Object.defineProperties(handle, {
		setPointerCapture: { configurable: true, value: vi.fn(capture) },
		hasPointerCapture: { configurable: true, value: vi.fn(() => true) },
		releasePointerCapture: { configurable: true, value: vi.fn() }
	});
}

function baseDrag(overrides: Partial<EditableListRowDrag> = {}): EditableListRowDrag {
	return {
		id: 'hero',
		label: 'Drag hero image',
		onDrop: vi.fn(),
		...overrides
	};
}

const fullCandidate = {
	sourceId: 'hero',
	targetId: 'detail',
	position: 'before'
} as const;

test('uses native list semantics and invokes only enabled reorder callbacks without submitting the form', async () => {
	const screen = await render(EditableListProbe);
	const form = screen.getByTestId('editable-list-probe');
	const fieldset = form.element().querySelector('fieldset') as HTMLFieldSetElement;
	expect(fieldset.querySelector('legend')?.textContent).toBe('Gallery images');
	expect(fieldset.querySelectorAll('ol > li')).toHaveLength(2);
	expect(fieldset.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
	const up = screen.getByRole('button', { name: 'Move second image up' });
	const down = screen.getByRole('button', { name: 'Move first image down' });
	const disabledUp = screen.getByRole('button', { name: 'Move first image up' });
	const disabledDown = screen.getByRole('button', { name: 'Move second image down' });
	expect(disabledUp).toBeDisabled();
	expect(disabledDown).toBeDisabled();
	(disabledUp.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	(disabledDown.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	expect(form).toHaveAttribute('data-up', '0');
	expect(form).toHaveAttribute('data-down', '0');
	await up.click();

	(down.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');

	expect(form).toHaveAttribute('data-up', '1');
	expect(form).toHaveAttribute('data-down', '1');
	expect(form).toHaveAttribute('data-submitted', '0');
	expect(document.activeElement).toBe(down.element());

	(up.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Space}');

	expect(form).toHaveAttribute('data-up', '2');
	expect(form).toHaveAttribute('data-down', '1');
	expect(form).toHaveAttribute('data-submitted', '0');
	expect(document.activeElement).toBe(up.element());
});

test('uses the consumer-owned isEmpty condition for a real empty each body', async () => {
	const screen = await render(EditableListStateProbe);
	const form = screen.getByTestId('editable-list-state-probe').element();

	expect(screen.getByText('No images yet.')).toBeInTheDocument();
	expect(form.querySelector('ol')).toBeNull();

	await screen.getByRole('button', { name: 'Add image' }).click();

	expect(form.textContent).not.toContain('No images yet.');
	expect(screen.getByRole('list')).toBeInTheDocument();
	expect(screen.getByRole('listitem')).toHaveTextContent('Hero image');

	const singleRowUp = screen.getByRole('button', { name: 'Move image up' });
	const singleRowDown = screen.getByRole('button', { name: 'Move image down' });

	expect(singleRowUp).toBeDisabled();
	expect(singleRowDown).toBeDisabled();

	(singleRowUp.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	(singleRowDown.element() as HTMLButtonElement).dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);

	expect(form).toHaveAttribute('data-move-count', '0');

	await screen.getByRole('button', { name: 'Remove image' }).click();

	expect(screen.getByText('No images yet.')).toBeInTheDocument();
	expect(form.querySelector('ol')).toBeNull();
});

test('supports repeated action labels with distinct consumer-owned position descriptions', async () => {
	const screen = await render(ReorderActionsPositionContextProbe);
	const root = screen.getByTestId('reorder-actions-position-context-probe');
	const buttons = [...root.element().querySelectorAll('button')];
	const moveUpButtons = [buttons[0], buttons[2]];
	const moveDownButtons = [buttons[1], buttons[3]];
	const descriptions = root.element().querySelectorAll(
		'.giu-reorder-actions__position-context'
	);

	expect(moveUpButtons).toHaveLength(2);
	expect(moveDownButtons).toHaveLength(2);
	expect(descriptions).toHaveLength(2);
	expect(descriptions[0]).toHaveTextContent('Hero image, position 1 of 2');
	expect(descriptions[1]).toHaveTextContent('Detail image, position 2 of 2');
	expect(moveUpButtons[0]).toHaveAccessibleName('Move item up');
	expect(moveUpButtons[0]).toHaveAccessibleDescription('Hero image, position 1 of 2');
	expect(moveDownButtons[1]).toHaveAccessibleDescription('Detail image, position 2 of 2');
	expect(moveUpButtons[0]).toHaveAttribute('aria-describedby', 'gallery-hero-reorder-context');
	expect(moveDownButtons[0]).toHaveAttribute('aria-describedby', 'gallery-hero-reorder-context');
	expect(moveUpButtons[1]).toHaveAttribute('aria-describedby', 'gallery-detail-reorder-context');
	expect(moveDownButtons[1]).toHaveAttribute('aria-describedby', 'gallery-detail-reorder-context');

	moveUpButtons[0].dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	expect(root).toHaveAttribute('data-first-moves', '0');

	moveDownButtons[0].dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	await tick();
	expect(root).toHaveAttribute('data-first-moves', '1');

	moveUpButtons[1].focus();
	await userEvent.keyboard('{Enter}');
	expect(root).toHaveAttribute('data-second-moves', '1');
	expect(document.activeElement).toBe(moveUpButtons[1]);

	moveDownButtons[1].dispatchEvent(
		new MouseEvent('click', { bubbles: true })
	);
	await tick();
	expect(root).toHaveAttribute('data-second-moves', '1');
});

test('starts only enabled primary pointer gestures on the explicit handle', async () => {
	const onDragStart = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({ onDragStart })
	});
	const row = document.querySelector('.giu-editable-list-row') as HTMLElement;
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown');
	await tick();

	expect(onDragStart).toHaveBeenCalledTimes(1);
	expect(onDragStart).toHaveBeenCalledWith('hero');
	expect(row).toHaveAttribute('data-giu-dragging', 'true');
	expect(handle.setPointerCapture).toHaveBeenCalledWith(1);

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			onDragStart,
			disabled: true
		})
	});
	const disabledHandle = dragHandle();
	expect(disabledHandle).toBeDisabled();
	dispatchPointer(disabledHandle, 'pointerdown', { pointerId: 2 });
	await tick();
	expect(onDragStart).toHaveBeenCalledTimes(1);
	expect(row).not.toHaveAttribute('data-giu-dragging');
});

test('ignores overlapping pointerdown while the first gesture remains authoritative', async () => {
	const onDragStart = vi.fn();
	const onDrop = vi.fn();
	await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: fullCandidate,
			onDragStart,
			onDrop
		})
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown', { pointerId: 1, clientX: 0 });
	dispatchPointer(handle, 'pointerdown', { pointerId: 2, clientX: 24 });
	dispatchPointer(handle, 'pointermove', { pointerId: 2, clientX: 40 });
	dispatchPointer(handle, 'pointerup', { pointerId: 2, clientX: 40 });
	await tick();

	expect(onDragStart).toHaveBeenCalledTimes(1);
	expect(handle.setPointerCapture).toHaveBeenCalledTimes(1);
	expect(handle.setPointerCapture).toHaveBeenCalledWith(1);
	expect(onDrop).not.toHaveBeenCalled();
	expect(handle.closest('.giu-editable-list-row')).toHaveAttribute('data-giu-dragging', 'true');

	dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 8 });
	dispatchPointer(handle, 'pointerup', { pointerId: 1, clientX: 8 });
	await tick();

	expect(onDrop).toHaveBeenCalledTimes(1);
	expect(onDrop).toHaveBeenCalledWith(fullCandidate);
	expect(handle.closest('.giu-editable-list-row')).not.toHaveAttribute('data-giu-dragging');
});

test('ignores non-primary pointers and non-primary mouse buttons', async () => {
	const onDragStart = vi.fn();
	await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({ onDragStart })
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown', { isPrimary: false });
	dispatchPointer(handle, 'pointerdown', { button: 1 });

	expect(onDragStart).not.toHaveBeenCalled();
	expect(handle.setPointerCapture).not.toHaveBeenCalled();
});

test('waits for the four-pixel threshold and reports only semantic candidate changes', async () => {
	const onDragCandidate = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({ onDragCandidate })
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointermove', { clientX: 3, clientY: 0 });
	expect(onDragCandidate).not.toHaveBeenCalled();

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: fullCandidate,
			onDragCandidate
		})
	});
	const firstMove = dispatchPointer(dragHandle(), 'pointermove', { clientX: 4, clientY: 0 });
	expect(firstMove.defaultPrevented).toBe(true);
	expect(onDragCandidate).toHaveBeenCalledTimes(1);
	expect(onDragCandidate).toHaveBeenCalledWith({
		sourceId: 'hero',
		targetId: 'detail',
		position: 'before'
	});

	dispatchPointer(dragHandle(), 'pointermove', { clientX: 5, clientY: 0 });
	expect(onDragCandidate).toHaveBeenCalledTimes(1);

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: { sourceId: 'hero', targetId: 'detail', position: 'after' },
			onDragCandidate
		})
	});
	dispatchPointer(dragHandle(), 'pointermove', { clientX: 6, clientY: 0 });
	expect(onDragCandidate).toHaveBeenLastCalledWith({
		sourceId: 'hero',
		targetId: 'detail',
		position: 'after'
	});

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({ candidate: null, onDragCandidate })
	});
	dispatchPointer(dragHandle(), 'pointermove', { clientX: 7, clientY: 0 });
	dispatchPointer(dragHandle(), 'pointermove', { clientX: 8, clientY: 0 });
	expect(onDragCandidate).toHaveBeenCalledTimes(3);
	expect(onDragCandidate).toHaveBeenLastCalledWith(null);
});

test('does not emit spurious null candidates and emits one null on non-null to invalid transition', async () => {
	const onDragCandidate = vi.fn();
	const onDragCancel = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({ onDragCandidate, onDragCancel })
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointermove', { clientX: 8 });
	dispatchPointer(handle, 'pointercancel', { clientX: 8 });
	expect(onDragCandidate).not.toHaveBeenCalled();
	expect(onDragCancel).toHaveBeenCalledTimes(1);

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({ candidate: fullCandidate, onDragCandidate, onDragCancel })
	});
	dispatchPointer(dragHandle(), 'pointerdown');
	dispatchPointer(dragHandle(), 'pointermove', { clientX: 8 });
	expect(onDragCandidate).toHaveBeenCalledTimes(1);
	expect(onDragCandidate).toHaveBeenLastCalledWith(fullCandidate);

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({ candidate: null, onDragCandidate, onDragCancel })
	});
	dispatchPointer(dragHandle(), 'pointermove', { clientX: 9 });
	dispatchPointer(dragHandle(), 'pointercancel', { clientX: 9 });

	expect(onDragCandidate).toHaveBeenCalledTimes(2);
	expect(onDragCandidate).toHaveBeenLastCalledWith(null);
	expect(onDragCancel).toHaveBeenCalledTimes(2);
});

test.each([
	['before', 'mouse'],
	['after', 'pen'],
	['after', 'touch']
] as const)('drops a valid %s candidate from a %s pointer', async (position, pointerType) => {
	const onDrop = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({ onDrop })
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown', { pointerType });
	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: { sourceId: 'hero', targetId: 'detail', position },
			onDrop
		})
	});
	dispatchPointer(dragHandle(), 'pointermove', { pointerType, clientX: 8 });
	dispatchPointer(dragHandle(), 'pointerup', { pointerType, clientX: 8 });

	expect(onDrop).toHaveBeenCalledTimes(1);
	expect(onDrop).toHaveBeenCalledWith({
		sourceId: 'hero',
		targetId: 'detail',
		position
	});
});

test('does not drop without threshold, without candidate, or on self candidates', async () => {
	const onDrop = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({ onDrop })
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointerup');
	expect(onDrop).not.toHaveBeenCalled();

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointermove', { clientX: 8 });
	dispatchPointer(handle, 'pointerup', { clientX: 8 });
	expect(onDrop).not.toHaveBeenCalled();

	await screen.rerender({
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: { sourceId: 'hero', targetId: 'hero', position: 'before' },
			onDrop
		})
	});
	dispatchPointer(dragHandle(), 'pointerdown');
	dispatchPointer(dragHandle(), 'pointermove', { clientX: 8 });
	dispatchPointer(dragHandle(), 'pointerup', { clientX: 8 });
	expect(onDrop).not.toHaveBeenCalled();
	expect(document.querySelector('.giu-editable-list-row')).not.toHaveAttribute('data-giu-drop-candidate');
});

test.each([
	['pointercancel', 'pointercancel'],
	['lostpointercapture', 'lostpointercapture']
] as const)('cancels active pointer gestures on %s', async (eventType, reason) => {
	const onDrop = vi.fn();
	const onDragCancel = vi.fn();
	const onDragCandidate = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: fullCandidate,
			onDrop,
			onDragCancel,
			onDragCandidate
		})
	});
	const handle = dragHandle();
	stubPointerCapture(handle);

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointermove', { clientX: 8 });
	dispatchPointer(handle, eventType, { clientX: 8 });
	await tick();

	expect(onDrop).not.toHaveBeenCalled();
	expect(onDragCancel).toHaveBeenCalledTimes(1);
	expect(onDragCancel).toHaveBeenCalledWith(reason);
	expect(onDragCandidate).toHaveBeenLastCalledWith(null);
	expect(document.querySelector('.giu-editable-list-row')).not.toHaveAttribute('data-giu-dragging');
	await screen.unmount();
});

test('cancels active pointer gestures on Escape without moving focus', async () => {
	const onDrop = vi.fn();
	const onDragCancel = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: { sourceId: 'hero', targetId: 'detail', position: 'after' },
			onDrop,
			onDragCancel
		})
	});
	const handle = dragHandle();
	stubPointerCapture(handle);
	handle.focus();

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointermove', { clientX: 8 });
	await userEvent.keyboard('{Escape}');

	expect(onDrop).not.toHaveBeenCalled();
	expect(onDragCancel).toHaveBeenCalledTimes(1);
	expect(onDragCancel).toHaveBeenCalledWith('escape');
	expect(document.activeElement).toBe(handle);
	expect(document.querySelector('.giu-editable-list-row')).not.toHaveAttribute('data-giu-dragging');
	await screen.unmount();
});

test('tolerates pointer-capture failure and releases capture defensively', async () => {
	const onDrop = vi.fn();
	const screen = await render(EditableListRow, {
		position: 1,
		fields: rowFields,
		drag: baseDrag({
			candidate: { sourceId: 'hero', targetId: 'detail', position: 'after' },
			onDrop
		})
	});
	const handle = dragHandle();
	stubPointerCapture(handle, () => {
		throw new Error('capture unavailable');
	});

	dispatchPointer(handle, 'pointerdown');
	dispatchPointer(handle, 'pointermove', { clientX: 8 });
	dispatchPointer(handle, 'pointerup', { clientX: 8 });

	expect(onDrop).toHaveBeenCalledTimes(1);
	expect(handle.releasePointerCapture).toHaveBeenCalledWith(1);
});

test('keeps handle clicks out of form submission and reorder actions independently keyboard-operable', async () => {
	const screen = await render(EditableListDragProbe);
	const root = screen.getByTestId('editable-list-drag-probe');
	const handle = screen.getByRole('button', { name: 'Drag hero image' }).element();
	const disabledHandle = screen.getByRole('button', { name: 'Drag detail image' });
	const moveDown = screen.getByRole('button', { name: 'Move hero image down' });

	expect(disabledHandle).toBeDisabled();
	(handle as HTMLButtonElement).click();
	expect(root).toHaveAttribute('data-submitted', '0');

	(moveDown.element() as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');
	expect(root).toHaveAttribute('data-down', '1');
	expect(root).toHaveAttribute('data-submitted', '0');
	expect(document.activeElement).toBe(moveDown.element());
});

test('presents controlled candidates only on the target row while source drop keeps the full candidate', async () => {
	const screen = await render(EditableListDragProbe);
	const root = screen.getByTestId('editable-list-drag-probe');
	const rows = [...document.querySelectorAll('.giu-editable-list-row')] as HTMLElement[];
	const sourceHandle = screen.getByRole('button', { name: 'Drag hero image' }).element() as HTMLButtonElement;
	stubPointerCapture(sourceHandle);

	await screen.getByTestId('candidate-before').click();
	await tick();

	expect(rows[0]).not.toHaveAttribute('data-giu-drop-candidate');
	expect(rows[1]).toHaveAttribute('data-giu-drop-candidate', 'before');
	expect(rows[0].className).not.toContain('hero');
	expect(rows[1].className).not.toContain('detail');

	dispatchPointer(sourceHandle, 'pointerdown');
	dispatchPointer(sourceHandle, 'pointermove', { clientX: 8 });
	dispatchPointer(sourceHandle, 'pointerup', { clientX: 8 });
	await tick();

	expect(root).toHaveAttribute('data-drops', '1');
	expect(root).toHaveAttribute('data-drop-source', 'hero');
	expect(root).toHaveAttribute('data-drop-target', 'detail');
	expect(root).toHaveAttribute('data-drop-position', 'before');
});
