<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { onDestroy, tick } from 'svelte';

	import type { DialogProps as Props } from './dialog.js';

	const focusableSelector = [
		'button',
		'input',
		'select',
		'textarea',
		'a[href]',
		'[tabindex]'
	].join(',');

	let {
		open,
		onopenchange,
		children,
		class: className,
		style,
		oncancel,
		onclose,
		onclick,
		...nativeAttributes
	}: Props = $props();

	let dialog = $state<HTMLDialogElement>();
	let restoreTarget: HTMLElement | null = null;
	let previousOpen = false;
	let lifecycleVersion = 0;
	let destroying = false;

	$effect(() => {
		if (!BROWSER || !dialog?.isConnected) return;

		const version = ++lifecycleVersion;

		if (open) {
			if (!previousOpen) {
				restoreTarget = resolveRestoreTarget();
			}

			previousOpen = true;

			if (!dialog.open) {
				dialog.showModal();
			}

			void focusDialogContent(version);
			return;
		}

		const shouldRestore = previousOpen || restoreTarget !== null;
		previousOpen = false;

		if (dialog.open) {
			dialog.close();
		}

		if (shouldRestore) {
			void completeClose(version);
		}
	});

	onDestroy(() => {
		destroying = true;
		lifecycleVersion += 1;

		if (dialog?.open) {
			dialog.close();
		}

		restoreTarget = null;
	});

	function resolveRestoreTarget(): HTMLElement | null {
		const activeElement = document.activeElement;

		if (!(activeElement instanceof HTMLElement)) return null;
		if (!activeElement.isConnected) return null;
		if (activeElement === document.body) return null;
		if (activeElement === document.documentElement) return null;
		if (dialog?.contains(activeElement)) return null;

		return activeElement;
	}

	function isProgrammaticallyFocusableElement(
		element: Element
	): element is HTMLElement {
		if (!(element instanceof HTMLElement)) return false;
		if (!element.isConnected) return false;
		if (element.hidden || element.closest('[hidden]')) return false;
		if (element.matches(':disabled')) return false;
		if (element instanceof HTMLInputElement && element.type === 'hidden') return false;

		return element.matches(focusableSelector);
	}

	function isFocusableElement(element: Element): element is HTMLElement {
		if (!isProgrammaticallyFocusableElement(element)) return false;
		if (element.tabIndex < 0) return false;

		return true;
	}

	function findAutofocusDescendant(root: HTMLDialogElement): HTMLElement | null {
		for (const element of root.querySelectorAll('[autofocus]')) {
			if (isProgrammaticallyFocusableElement(element)) return element;
		}

		return null;
	}

	function findFirstFocusableDescendant(root: HTMLDialogElement): HTMLElement | null {
		for (const element of root.querySelectorAll(focusableSelector)) {
			if (isFocusableElement(element)) return element;
		}

		return null;
	}

	async function focusDialogContent(version: number): Promise<void> {
		await tick();

		if (
			destroying ||
			version !== lifecycleVersion ||
			!open ||
			!dialog?.isConnected ||
			!dialog.open
		) {
			return;
		}

		const target =
			findAutofocusDescendant(dialog) ??
			findFirstFocusableDescendant(dialog) ??
			dialog;

		target.focus({ preventScroll: true });
	}

	async function completeClose(version: number): Promise<void> {
		await tick();

		if (destroying || version !== lifecycleVersion) return;

		const target = restoreTarget;
		restoreTarget = null;

		if (target && isFocusableElement(target)) {
			target.focus({ preventScroll: true });
		}
	}

	async function reconcileUnexpectedClose(version: number): Promise<void> {
		await tick();

		if (destroying || version !== lifecycleVersion || !dialog?.isConnected) return;

		if (open) {
			previousOpen = true;

			if (!dialog.open) {
				dialog.showModal();
			}

			void focusDialogContent(version);
			return;
		}

		await completeClose(version);
	}

	function requestClose(): void {
		onopenchange(false);
	}

	function handleCancel(event: Event & { currentTarget: EventTarget & HTMLDialogElement }): void {
		event.preventDefault();
		requestClose();
		oncancel?.(event);
	}

	function handleDialogClose(event: Event & { currentTarget: EventTarget & HTMLDialogElement }): void {
		if (destroying) {
			onclose?.(event);
			return;
		}

		/*
		 * A native close event is queued after close(). If the controlled
		 * dialog has already reopened before that task is delivered, the
		 * current native dialog is open again and the event belongs to the
		 * previous modal session. Preserve callback composition, but do not
		 * reinterpret that stale event as a close request for the new session.
		 */
		if (event.currentTarget.open) {
			onclose?.(event);
			return;
		}

		const version = ++lifecycleVersion;
		previousOpen = false;

		if (open) {
			requestClose();
			void reconcileUnexpectedClose(version);
		} else {
			void completeClose(version);
		}

		onclose?.(event);
	}

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement }): void {
		if (event.target === dialog && dialog) {
			const rect = dialog.getBoundingClientRect();
			const outside =
				event.clientX < rect.left ||
				event.clientX > rect.right ||
				event.clientY < rect.top ||
				event.clientY > rect.bottom;

			if (outside) {
				requestClose();
			}
		}

		onclick?.(event);
	}
</script>

<dialog
	{...nativeAttributes}
	bind:this={dialog}
	class={['giu-dialog', className]}
	{style}
	oncancel={handleCancel}
	onclose={handleDialogClose}
	onclick={handleClick}
>
	{@render children()}
</dialog>

<style>
	.giu-dialog {
		box-sizing: border-box;
		width: var(--giu-dialog-width, min(calc(100vw - 2rem), 40rem));
		max-width: var(--giu-dialog-max-width, calc(100vw - 2rem));
		max-height: var(--giu-dialog-max-height, calc(100vh - 2rem));
		margin: auto;
		padding: var(--giu-dialog-padding, 1.25rem);
		border: var(--giu-dialog-border-width, 1px) solid
			var(--giu-dialog-border-color, #767676);
		border-radius: var(--giu-dialog-border-radius, 0.5rem);
		color: var(--giu-dialog-color, #202020);
		background: var(--giu-dialog-background, #ffffff);
		box-shadow: var(--giu-dialog-box-shadow, 0 1.25rem 3rem rgb(0 0 0 / 0.24));
		overflow: auto;
	}

	.giu-dialog::backdrop {
		background: var(--giu-dialog-backdrop-background, rgb(0 0 0 / 0.48));
	}

	.giu-dialog:focus-visible {
		outline: var(--giu-dialog-focus-width, 3px) solid
			var(--giu-dialog-focus-color, #1559a6);
		outline-offset: var(--giu-dialog-focus-offset, 2px);
	}

	@media (forced-colors: active) {
		.giu-dialog {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
			box-shadow: none;
		}

		.giu-dialog::backdrop {
			background: CanvasText;
			opacity: 0.45;
		}

		.giu-dialog:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
