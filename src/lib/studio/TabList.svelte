<script lang="ts">
	import { useTabsContext } from './tabs-internal.js';

	import type { TabListProps as Props } from './tabs.js';

	type TabListKeydownEvent = Parameters<NonNullable<Props['onkeydown']>>[0];

	let {
		orientation = 'horizontal',
		children,
		class: className,
		style,
		onkeydown,
		...nativeAttributes
	}: Props = $props();

	const tabs = useTabsContext();

	function isOwnedTab(
		element: Element,
		list: HTMLDivElement
	): element is HTMLButtonElement {
		return (
			element instanceof HTMLButtonElement &&
			element.getAttribute('role') === 'tab' &&
			element.dataset.giuTabsRoot === tabs.getRootId() &&
			element.closest('[role="tablist"]') === list
		);
	}

	function getEnabledTabs(list: HTMLDivElement): HTMLButtonElement[] {
		return Array.from(
			list.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
		).filter(
			(tab) =>
				isOwnedTab(tab, list) &&
				!tab.disabled
		);
	}

	function handleKeydown(event: TabListKeydownEvent) {
		const list = event.currentTarget;

		if (!(list instanceof HTMLDivElement)) {
			onkeydown?.(event);
			return;
		}

		const target = event.target;

		if (
			!(target instanceof Element) ||
			!isOwnedTab(target, list) ||
			target.disabled
		) {
			onkeydown?.(event);
			return;
		}

		const enabledTabs = getEnabledTabs(list);
		const currentIndex = enabledTabs.indexOf(target);

		if (currentIndex === -1 || enabledTabs.length === 0) {
			onkeydown?.(event);
			return;
		}

		let nextTab: HTMLButtonElement | undefined;

		if (
			orientation === 'horizontal' &&
			event.key === 'ArrowLeft'
		) {
			nextTab =
				enabledTabs[
					(currentIndex - 1 + enabledTabs.length) %
						enabledTabs.length
				];
		} else if (
			orientation === 'horizontal' &&
			event.key === 'ArrowRight'
		) {
			nextTab =
				enabledTabs[
					(currentIndex + 1) % enabledTabs.length
				];
		} else if (
			orientation === 'vertical' &&
			event.key === 'ArrowUp'
		) {
			nextTab =
				enabledTabs[
					(currentIndex - 1 + enabledTabs.length) %
						enabledTabs.length
				];
		} else if (
			orientation === 'vertical' &&
			event.key === 'ArrowDown'
		) {
			nextTab =
				enabledTabs[
					(currentIndex + 1) % enabledTabs.length
				];
		} else if (event.key === 'Home') {
			nextTab = enabledTabs[0];
		} else if (event.key === 'End') {
			nextTab = enabledTabs.at(-1);
		}

		if (nextTab) {
			event.preventDefault();
			nextTab.focus();
			onkeydown?.(event);
			return;
		}

		onkeydown?.(event);
	}
</script>

<div
	{...nativeAttributes}
	role="tablist"
	aria-orientation={orientation}
	class={['giu-tab-list', className]}
	{style}
	onkeydown={handleKeydown}
>
	{@render children()}
</div>

<style>
	.giu-tab-list {
		box-sizing: border-box;
		display: flex;
		min-width: 0;
		gap: var(--giu-tabs-list-gap, 0.25rem);
		border-bottom: var(--giu-tabs-list-border-width, 1px) solid
			var(--giu-tabs-list-border-color, #767676);
	}

	.giu-tab-list[aria-orientation='horizontal'] {
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.giu-tab-list[aria-orientation='vertical'] {
		flex-direction: column;
		align-items: stretch;
		border-right: var(--giu-tabs-list-border-width, 1px) solid
			var(--giu-tabs-list-border-color, #767676);
		border-bottom: 0;
	}
</style>
