<script lang="ts">
	import {
		useMenuButtonContext
	} from './menu-button-internal.js';

	import type { MenuItemProps as Props } from './menu-button.js';

	type MenuItemClickEvent =
		Parameters<NonNullable<Props['onclick']>>[0];
	type MenuItemKeydownEvent =
		Parameters<NonNullable<Props['onkeydown']>>[0];

	let {
		children,
		disabled = false,
		class: className,
		style,
		onclick,
		onkeydown,
		...nativeAttributes
	}: Props = $props();

	const menu = useMenuButtonContext();
	const rootId = $derived(menu.getRootId());

	function handleClick(event: MenuItemClickEvent): void {
		if (!disabled) {
			menu.closeMenu(true);
		}

		onclick?.(event);
	}

	function handleKeydown(event: MenuItemKeydownEvent): void {
		onkeydown?.(event);
	}
</script>

<button
	{...nativeAttributes}
	type="button"
	role="menuitem"
	disabled={disabled}
	tabindex="-1"
	data-giu-menu-root={rootId}
	class={['giu-menu-item', className]}
	{style}
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	{@render children()}
</button>

<style>
	.giu-menu-item {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		min-height: var(--giu-menu-button-item-min-height, 2.25rem);
		align-items: center;
		padding: var(--giu-menu-button-item-padding, 0.4375rem 0.625rem);
		border: 0;
		border-radius: var(--giu-menu-button-item-border-radius, 0.25rem);
		color: var(--giu-menu-button-item-color, inherit);
		background: var(--giu-menu-button-item-background, transparent);
		font: inherit;
		text-align: start;
		cursor: pointer;
	}

	.giu-menu-item:hover:not(:disabled),
	.giu-menu-item:focus-visible {
		background: var(--giu-menu-button-item-hover-background, #eeeeee);
	}

	.giu-menu-item:focus-visible {
		outline: var(--giu-menu-button-focus-width, 3px) solid
			var(--giu-menu-button-focus-color, #1559a6);
		outline-offset: var(--giu-menu-button-focus-offset, 1px);
	}

	.giu-menu-item:disabled {
		cursor: not-allowed;
		opacity: var(--giu-menu-button-disabled-opacity, 0.55);
	}

	@media (forced-colors: active) {
		.giu-menu-item:focus-visible {
			outline-color: Highlight;
		}

		.giu-menu-item:disabled {
			color: GrayText;
			opacity: 1;
		}
	}
</style>
