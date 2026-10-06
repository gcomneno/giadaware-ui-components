<script lang="ts">
	import { BROWSER } from 'esm-env';
	import {
		onDestroy,
		tick
	} from 'svelte';

	import {
		provideMenuButtonContext
	} from './menu-button-internal.js';

	import type { MenuButtonProps as Props } from './menu-button.js';

	let {
		trigger,
		children,
		id,
		disabled = false,
		class: className,
		style,
		triggerClass,
		triggerStyle,
		menuClass,
		menuStyle,
		...nativeAttributes
	}: Props = $props();

	let open = $state(false);
	let triggerElement = $state<HTMLButtonElement>();
	let menuElement = $state<HTMLDivElement>();

	const generatedId = $props.id();
	const rootId = $derived(id ?? generatedId);
	const triggerId = $derived(`${rootId}-trigger`);
	const menuId = $derived(`${rootId}-menu`);

	function isOwnedEnabledItem(
		element: Element
	): element is HTMLButtonElement {
		return (
			element instanceof HTMLButtonElement &&
			element.getAttribute('role') === 'menuitem' &&
			element.dataset.giuMenuRoot === rootId &&
			!element.disabled
		);
	}

	function getEnabledItems(): HTMLButtonElement[] {
		if (!menuElement) {
			return [];
		}

		return Array.from(
			menuElement.querySelectorAll<HTMLButtonElement>(
				'button[role="menuitem"]'
			)
		).filter(isOwnedEnabledItem);
	}

	async function focusBoundaryItem(
		boundary: 'first' | 'last'
	): Promise<void> {
		await tick();

		if (!open || disabled) {
			return;
		}

		const items = getEnabledItems();
		const target =
			boundary === 'first'
				? items[0]
				: items.at(-1);

		target?.focus({ preventScroll: true });
	}

	async function openMenu(
		boundary?: 'first' | 'last'
	): Promise<void> {
		if (disabled) {
			return;
		}

		open = true;

		if (boundary) {
			await focusBoundaryItem(boundary);
		}
	}

	function closeMenu(restoreFocus: boolean): void {
		if (!open) {
			return;
		}

		open = false;

		if (restoreFocus) {
			void tick().then(() => {
				if (
					triggerElement?.isConnected &&
					!triggerElement.disabled
				) {
					triggerElement.focus({
						preventScroll: true
					});
				}
			});
		}
	}

	function toggleMenu(): void {
		if (disabled) {
			return;
		}

		open = !open;
	}

	function handleTriggerKeydown(event: KeyboardEvent): void {
		if (disabled) {
			return;
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			void openMenu('first');
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			void openMenu('first');
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			void openMenu('last');
			return;
		}

		if (event.key === 'Escape' && open) {
			event.preventDefault();
			closeMenu(true);
			return;
		}

		if (event.key === 'Tab' && open) {
			closeMenu(false);
		}
	}

	function handleMenuKeydown(event: KeyboardEvent): void {
		const target = event.target;

		if (
			!(target instanceof Element) ||
			!isOwnedEnabledItem(target)
		) {
			return;
		}

		const items = getEnabledItems();
		const currentIndex = items.indexOf(target);

		if (currentIndex === -1) {
			return;
		}

		let nextItem: HTMLButtonElement | undefined;

		if (event.key === 'ArrowDown') {
			nextItem =
				items[(currentIndex + 1) % items.length];
		} else if (event.key === 'ArrowUp') {
			nextItem =
				items[
					(currentIndex - 1 + items.length) %
						items.length
				];
		} else if (event.key === 'Home') {
			nextItem = items[0];
		} else if (event.key === 'End') {
			nextItem = items.at(-1);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeMenu(true);
			return;
		} else if (event.key === 'Tab') {
			closeMenu(false);
			return;
		}

		if (nextItem) {
			event.preventDefault();
			nextItem.focus({ preventScroll: true });
		}
	}

	function handleDocumentPointerDown(
		event: PointerEvent
	): void {
		if (!open) {
			return;
		}

		const target = event.target;

		if (!(target instanceof Node)) {
			return;
		}

		if (
			triggerElement?.contains(target) ||
			menuElement?.contains(target)
		) {
			return;
		}

		closeMenu(false);
	}

	$effect(() => {
		if (disabled && open) {
			closeMenu(false);
		}
	});

	$effect(() => {
		if (!BROWSER || !open) {
			return;
		}

		document.addEventListener(
			'pointerdown',
			handleDocumentPointerDown
		);

		return () => {
			document.removeEventListener(
				'pointerdown',
				handleDocumentPointerDown
			);
		};
	});

	onDestroy(() => {
		if (BROWSER) {
			document.removeEventListener(
				'pointerdown',
				handleDocumentPointerDown
			);
		}
	});

	provideMenuButtonContext({
		getRootId: () => rootId,
		closeMenu
	});
</script>

<div
	{...nativeAttributes}
	id={rootId}
	class={['giu-menu-button', className]}
	{style}
>
	<button
		bind:this={triggerElement}
		id={triggerId}
		type="button"
		disabled={disabled}
		aria-haspopup="menu"
		aria-expanded={open ? 'true' : 'false'}
		aria-controls={menuId}
		class={['giu-menu-button__trigger', triggerClass]}
		style={triggerStyle}
		onclick={toggleMenu}
		onkeydown={handleTriggerKeydown}
	>
		{@render trigger()}
	</button>

	<div
		bind:this={menuElement}
		id={menuId}
		role="menu"
		aria-labelledby={triggerId}
		tabindex="-1"
		hidden={!open}
		class={['giu-menu-button__menu', menuClass]}
		style={menuStyle}
		onkeydown={handleMenuKeydown}
	>
		{@render children()}
	</div>
</div>

<style>
	.giu-menu-button {
		position: relative;
		display: inline-block;
		box-sizing: border-box;
	}

	.giu-menu-button__trigger {
		box-sizing: border-box;
		display: inline-flex;
		min-height: var(--giu-menu-button-trigger-min-height, 2.5rem);
		align-items: center;
		justify-content: center;
		gap: var(--giu-menu-button-trigger-gap, 0.375rem);
		padding: var(--giu-menu-button-trigger-padding, 0.5rem 0.75rem);
		border: var(--giu-menu-button-trigger-border-width, 1px) solid
			var(--giu-menu-button-trigger-border-color, #5f5f5f);
		border-radius: var(--giu-menu-button-trigger-border-radius, 0.375rem);
		color: var(--giu-menu-button-trigger-color, #202020);
		background: var(--giu-menu-button-trigger-background, #ffffff);
		font: inherit;
		cursor: pointer;
	}

	.giu-menu-button__trigger:hover:not(:disabled) {
		background: var(--giu-menu-button-trigger-hover-background, #eeeeee);
	}

	.giu-menu-button__trigger:focus-visible {
		outline: var(--giu-menu-button-focus-width, 3px) solid
			var(--giu-menu-button-focus-color, #1559a6);
		outline-offset: var(--giu-menu-button-focus-offset, 2px);
	}

	.giu-menu-button__trigger:disabled {
		cursor: not-allowed;
		opacity: var(--giu-menu-button-disabled-opacity, 0.55);
	}

	.giu-menu-button__menu {
		position: absolute;
		z-index: var(--giu-menu-button-z-index, 20);
		inset-block-start: calc(100% + var(--giu-menu-button-menu-offset, 0.25rem));
		inset-inline-start: 0;
		box-sizing: border-box;
		min-width: var(--giu-menu-button-menu-min-width, 10rem);
		padding: var(--giu-menu-button-menu-padding, 0.25rem);
		border: var(--giu-menu-button-menu-border-width, 1px) solid
			var(--giu-menu-button-menu-border-color, #767676);
		border-radius: var(--giu-menu-button-menu-border-radius, 0.375rem);
		color: var(--giu-menu-button-menu-color, #202020);
		background: var(--giu-menu-button-menu-background, #ffffff);
		box-shadow: var(
			--giu-menu-button-menu-shadow,
			0 0.375rem 1rem rgb(0 0 0 / 0.18)
		);
	}

	.giu-menu-button__menu[hidden] {
		display: none;
	}

	@media (forced-colors: active) {
		.giu-menu-button__trigger,
		.giu-menu-button__menu {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
			box-shadow: none;
		}

		.giu-menu-button__trigger:focus-visible {
			outline-color: Highlight;
		}

		.giu-menu-button__trigger:disabled {
			color: GrayText;
			opacity: 1;
		}
	}
</style>
