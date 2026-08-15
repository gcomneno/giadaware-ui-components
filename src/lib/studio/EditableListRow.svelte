<script lang="ts">
	import { onDestroy } from 'svelte';
	import type {
		EditableListRowDrag,
		EditableListRowDragCancelReason,
		EditableListRowDragCandidate,
		EditableListRowDropPosition,
		EditableListRowProps as Props
	} from './editable-list-row.js';

	type ValidDrag = {
		id: string;
		label: string;
		disabled: boolean;
		candidate: EditableListRowDrag['candidate'];
		onDragStart?: (sourceId: string) => void;
		onDragCandidate?: (candidate: EditableListRowDragCandidate | null) => void;
		onDrop: (candidate: EditableListRowDragCandidate) => void;
		onDragCancel?: (reason: EditableListRowDragCancelReason) => void;
	};

	type ActiveGesture = {
		pointerId: number;
		startX: number;
		startY: number;
		thresholdCrossed: boolean;
		lastNotifiedCandidateKey: string | null;
		handle: HTMLButtonElement;
	};

	const movementThreshold = 4;
	const validPositions = new Set<EditableListRowDropPosition>(['before', 'after']);

	function hasNoWhitespace(value: string): boolean {
		return Boolean(value) && !/\s/.test(value);
	}

	function resolveValidDrag(value: EditableListRowDrag | undefined): ValidDrag | null {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return null;
		}

		if (
			typeof value.id !== 'string' ||
			value.id.trim() !== value.id ||
			!hasNoWhitespace(value.id) ||
			typeof value.label !== 'string' ||
			value.label.trim() !== value.label ||
			!value.label ||
			typeof value.onDrop !== 'function'
		) {
			return null;
		}

		return {
			id: value.id,
			label: value.label,
			disabled: value.disabled === true,
			candidate: value.candidate,
			onDragStart: value.onDragStart,
			onDragCandidate: value.onDragCandidate,
			onDrop: value.onDrop,
			onDragCancel: value.onDragCancel
		};
	}

	function resolveValidCandidate(drag: ValidDrag | null): EditableListRowDragCandidate | null {
		const candidate = drag?.candidate;

		if (!drag || !candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
			return null;
		}

		if (
			typeof candidate.sourceId !== 'string' ||
			candidate.sourceId.trim() !== candidate.sourceId ||
			!hasNoWhitespace(candidate.sourceId) ||
			typeof candidate.targetId !== 'string' ||
			candidate.targetId.trim() !== candidate.targetId ||
			!hasNoWhitespace(candidate.targetId) ||
			!validPositions.has(candidate.position) ||
			candidate.sourceId === candidate.targetId
		) {
			return null;
		}

		return {
			sourceId: candidate.sourceId,
			targetId: candidate.targetId,
			position: candidate.position
		};
	}

	function candidateKey(candidate: EditableListRowDragCandidate | null): string | null {
		return candidate ? `${candidate.sourceId}:${candidate.targetId}:${candidate.position}` : null;
	}

	let { position, fields, actions, drag, class: className, style }: Props = $props();
	let activeGesture = $state<ActiveGesture | null>(null);
	const normalizedPosition = $derived(
		typeof position === 'number' && Number.isFinite(position) && Number.isInteger(position) && position >= 1
			? position
			: 1
	);
	const validDrag = $derived(resolveValidDrag(drag));
	const validCandidate = $derived(resolveValidCandidate(validDrag));
	const sourceCandidate = $derived(
		validDrag && validCandidate?.sourceId === validDrag.id ? validCandidate : null
	);
	const dropCandidatePosition = $derived(
		validDrag && validCandidate?.targetId === validDrag.id ? validCandidate.position : undefined
	);

	function notifyCandidate(candidate: EditableListRowDragCandidate | null): void {
		if (!activeGesture || !validDrag?.onDragCandidate) {
			return;
		}

		const nextKey = candidateKey(candidate);

		if (activeGesture.lastNotifiedCandidateKey === nextKey) {
			return;
		}

		if (nextKey === null && activeGesture.lastNotifiedCandidateKey === null) {
			return;
		}

		activeGesture.lastNotifiedCandidateKey = nextKey;
		validDrag.onDragCandidate(candidate);
	}

	function releaseCapture(gesture: ActiveGesture): void {
		try {
			if (gesture.handle.hasPointerCapture?.(gesture.pointerId)) {
				gesture.handle.releasePointerCapture(gesture.pointerId);
			}
		} catch {
			// Pointer capture can already be gone when browsers synthesize cancellation.
		}
	}

	function clearGesture(): ActiveGesture | null {
		const gesture = activeGesture;
		activeGesture = null;

		if (gesture) {
			releaseCapture(gesture);
		}

		return gesture;
	}

	function cancelGesture(reason: EditableListRowDragCancelReason): void {
		const gesture = activeGesture;

		if (!gesture) {
			return;
		}

		notifyCandidate(null);
		const callback = validDrag?.onDragCancel;
		clearGesture();
		callback?.(reason);
	}

	function handlePointerDown(event: PointerEvent): void {
		if (activeGesture) {
			return;
		}

		if (!validDrag || validDrag.disabled || !event.isPrimary) {
			return;
		}

		if (event.pointerType === 'mouse' && event.button !== 0) {
			return;
		}

		const handle = event.currentTarget;

		if (!(handle instanceof HTMLButtonElement)) {
			return;
		}

		activeGesture = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			thresholdCrossed: false,
			lastNotifiedCandidateKey: null,
			handle
		};

		try {
			handle.setPointerCapture(event.pointerId);
		} catch {
			// Pointer capture is a progressive enhancement and can fail in tests or edge browsers.
		}

		validDrag.onDragStart?.(validDrag.id);
	}

	function handlePointerMove(event: PointerEvent): void {
		if (!activeGesture || event.pointerId !== activeGesture.pointerId) {
			return;
		}

		if (!activeGesture.thresholdCrossed) {
			const dx = event.clientX - activeGesture.startX;
			const dy = event.clientY - activeGesture.startY;

			if (dx * dx + dy * dy < movementThreshold * movementThreshold) {
				return;
			}

			activeGesture.thresholdCrossed = true;
		}

		if (event.cancelable) {
			event.preventDefault();
		}

		notifyCandidate(sourceCandidate);
	}

	function handlePointerUp(event: PointerEvent): void {
		if (!activeGesture || event.pointerId !== activeGesture.pointerId) {
			return;
		}

		const shouldDrop = activeGesture.thresholdCrossed;
		const candidate = sourceCandidate;
		const drop = validDrag?.onDrop;

		clearGesture();

		if (shouldDrop && candidate && drop) {
			drop(candidate);
		}
	}

	function handlePointerCancel(event: PointerEvent): void {
		if (activeGesture && event.pointerId === activeGesture.pointerId) {
			cancelGesture('pointercancel');
		}
	}

	function handleLostPointerCapture(event: PointerEvent): void {
		if (activeGesture && event.pointerId === activeGesture.pointerId) {
			cancelGesture('lostpointercapture');
		}
	}

	function handleEscape(event: KeyboardEvent): void {
		if (!activeGesture || event.key !== 'Escape') {
			return;
		}

		if (event.cancelable) {
			event.preventDefault();
		}

		cancelGesture('escape');
	}

	$effect(() => {
		if (activeGesture && (!validDrag || validDrag.disabled)) {
			clearGesture();
		}
	});

	$effect(() => {
		if (!activeGesture) {
			return;
		}

		window.addEventListener('keydown', handleEscape);

		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	});

	onDestroy(() => {
		if (activeGesture) {
			clearGesture();
		}
	});
</script>

<li
	class={['giu-editable-list-row', className]}
	{style}
	data-giu-dragging={activeGesture ? 'true' : undefined}
	data-giu-drop-candidate={dropCandidatePosition}
>
	<div class="giu-editable-list-row__lead">
		<span class="giu-editable-list-row__position" aria-hidden="true">{normalizedPosition}</span>
		{#if validDrag}
			<button
				type="button"
				aria-label={validDrag.label}
				disabled={validDrag.disabled}
				data-giu-drag-handle
				class="giu-editable-list-row__drag-handle"
				onpointerdown={handlePointerDown}
				onpointermove={handlePointerMove}
				onpointerup={handlePointerUp}
				onpointercancel={handlePointerCancel}
				onlostpointercapture={handleLostPointerCapture}
			>
				<span aria-hidden="true">↕</span>
			</button>
		{/if}
	</div>
	<div class="giu-editable-list-row__fields">{@render fields()}</div>
	{#if actions}
		<div class="giu-editable-list-row__actions">{@render actions()}</div>
	{/if}
</li>

<style>
	.giu-editable-list-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: start; gap: var(--giu-editable-list-row-gap, 0.75rem); box-sizing: border-box; min-width: 0; padding: var(--giu-editable-list-row-padding, 0.75rem); border: var(--giu-editable-list-row-border, 1px solid #d0d0d0); border-radius: var(--giu-editable-list-row-border-radius, 0.5rem); background: var(--giu-editable-list-row-background, #ffffff); }
	.giu-editable-list-row__lead { display: flex; align-items: flex-start; gap: var(--giu-editable-list-row-lead-gap, 0.5rem); min-width: 0; }
	.giu-editable-list-row__position { display: grid; min-width: var(--giu-editable-list-row-position-min-width, 1.5rem); min-height: var(--giu-editable-list-row-position-min-height, 2.75rem); place-items: center; color: var(--giu-editable-list-row-position-color, #505050); font-weight: var(--giu-editable-list-row-position-weight, 600); }
	.giu-editable-list-row__drag-handle { display: grid; width: var(--giu-editable-list-row-drag-handle-size, 2.75rem); height: var(--giu-editable-list-row-drag-handle-size, 2.75rem); flex: 0 0 auto; place-items: center; padding: 0; border: var(--giu-editable-list-row-drag-handle-border, 1px solid #b8b8b8); border-radius: var(--giu-editable-list-row-drag-handle-border-radius, 0.375rem); background: var(--giu-editable-list-row-drag-handle-background, #ffffff); color: var(--giu-editable-list-row-drag-handle-color, #404040); font: inherit; line-height: 1; touch-action: none; cursor: grab; user-select: none; }
	.giu-editable-list-row__drag-handle:active { cursor: grabbing; }
	.giu-editable-list-row__drag-handle:disabled { cursor: not-allowed; opacity: var(--giu-editable-list-row-drag-handle-disabled-opacity, 0.55); }
	.giu-editable-list-row__fields { min-width: 0; }
	.giu-editable-list-row__actions { display: flex; flex: 0 0 auto; align-items: center; }
	@media (max-width: 40rem) { .giu-editable-list-row { grid-template-columns: auto minmax(0, 1fr); } .giu-editable-list-row__actions { grid-column: 2; } }
</style>
