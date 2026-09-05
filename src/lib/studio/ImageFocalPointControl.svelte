<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		imageFocalPointFromClientPoint,
		moveImageFocalPointValue,
		normalizeImageFocalPointValue
	} from './image-focal-point-control.js';
	import type {
		ImageFocalPointControlProps as Props,
		ImageFocalPointValue
	} from './image-focal-point-control.js';

	type ActivePointer = {
		pointerId: number;
		surface: HTMLButtonElement;
	};

	const keyboardStep = 0.01;
	const keyboardLargeStep = 0.1;

	let {
		image,
		value = null,
		onvaluechange,
		label,
		disabled = false,
		id = undefined,
		class: className = undefined,
		style = undefined
	}: Props = $props();

	let activePointer = $state<ActivePointer | null>(null);
	let lastRequested = $state<ImageFocalPointValue | null>(null);

	const normalizedValue = $derived(normalizeImageFocalPointValue(value));
	const formattedX = $derived(normalizedValue.x.toFixed(4));
	const formattedY = $derived(normalizedValue.y.toFixed(4));
	const markerStyle = $derived(
		`left:${normalizedValue.x * 100}%;top:${normalizedValue.y * 100}%`
	);

	function sameValue(
		left: ImageFocalPointValue | null,
		right: ImageFocalPointValue
	): boolean {
		return left?.x === right.x && left.y === right.y;
	}

	function requestValue(next: ImageFocalPointValue): void {
		if (disabled) {
			return;
		}

		const normalizedNext = normalizeImageFocalPointValue(next);

		if (
			sameValue(normalizedValue, normalizedNext) ||
			sameValue(lastRequested, normalizedNext)
		) {
			return;
		}

		lastRequested = normalizedNext;
		onvaluechange(normalizedNext);
	}

	function releaseCapture(pointer: ActivePointer): void {
		try {
			if (pointer.surface.hasPointerCapture?.(pointer.pointerId)) {
				pointer.surface.releasePointerCapture(pointer.pointerId);
			}
		} catch {
			// Pointer capture can already be gone when browsers synthesize cancellation.
		}
	}

	function clearActivePointer(): void {
		const pointer = activePointer;
		activePointer = null;

		if (pointer) {
			releaseCapture(pointer);
		}
	}

	function requestPointerValue(event: PointerEvent, surface: HTMLButtonElement): void {
		requestValue(
			imageFocalPointFromClientPoint(
				event.clientX,
				event.clientY,
				surface.getBoundingClientRect()
			)
		);
	}

	function handlePointerDown(event: PointerEvent): void {
		if (disabled || activePointer || !event.isPrimary) {
			return;
		}

		if (event.pointerType === 'mouse' && event.button !== 0) {
			return;
		}

		const surface = event.currentTarget;

		if (!(surface instanceof HTMLButtonElement)) {
			return;
		}

		activePointer = {
			pointerId: event.pointerId,
			surface
		};

		try {
			surface.setPointerCapture(event.pointerId);
		} catch {
			// Pointer capture is a progressive enhancement and can fail in tests.
		}

		requestPointerValue(event, surface);
	}

	function handlePointerMove(event: PointerEvent): void {
		if (!activePointer || event.pointerId !== activePointer.pointerId) {
			return;
		}

		if (event.cancelable) {
			event.preventDefault();
		}

		requestPointerValue(event, activePointer.surface);
	}

	function handlePointerUp(event: PointerEvent): void {
		if (activePointer && event.pointerId === activePointer.pointerId) {
			clearActivePointer();
		}
	}

	function handlePointerCancel(event: PointerEvent): void {
		if (activePointer && event.pointerId === activePointer.pointerId) {
			clearActivePointer();
		}
	}

	function handleLostPointerCapture(event: PointerEvent): void {
		if (activePointer && event.pointerId === activePointer.pointerId) {
			activePointer = null;
		}
	}

	function handleKeyDown(event: KeyboardEvent): void {
		const step = event.shiftKey ? keyboardLargeStep : keyboardStep;
		const deltaByKey: Partial<Record<string, ImageFocalPointValue>> = {
			ArrowLeft: { x: -step, y: 0 },
			ArrowRight: { x: step, y: 0 },
			ArrowUp: { x: 0, y: -step },
			ArrowDown: { x: 0, y: step }
		};
		const delta = deltaByKey[event.key];

		if (!delta) {
			return;
		}

		if (event.cancelable) {
			event.preventDefault();
		}

		requestValue(moveImageFocalPointValue(normalizedValue, delta));
	}

	$effect(() => {
		normalizedValue.x;
		normalizedValue.y;
		lastRequested = null;
	});

	$effect(() => {
		if (disabled && activePointer) {
			clearActivePointer();
		}
	});

	onDestroy(() => {
		clearActivePointer();
	});
</script>

<div
	class={['giu-image-focal-point-control', className]}
	{style}
	data-giu-disabled={disabled ? 'true' : undefined}
	data-giu-focal-x={formattedX}
	data-giu-focal-y={formattedY}
>
	<button
		type="button"
		{id}
		class="giu-image-focal-point-control__surface"
		aria-label={label}
		aria-keyshortcuts="ArrowUp ArrowRight ArrowDown ArrowLeft"
		{disabled}
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerCancel}
		onlostpointercapture={handleLostPointerCapture}
		onkeydown={handleKeyDown}
	>
		<img
			class="giu-image-focal-point-control__image"
			src={image.src}
			alt={image.alt}
			draggable="false"
		/>
		<span
			class="giu-image-focal-point-control__marker"
			style={markerStyle}
			aria-hidden="true"
		></span>
	</button>
</div>
