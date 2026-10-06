<script lang="ts">
	import { useTabsContext } from './tabs-internal.js';

	import type { TabProps as Props } from './tabs.js';

	type TabClickEvent = Parameters<NonNullable<Props['onclick']>>[0];
	type TabFocusEvent = Parameters<NonNullable<Props['onfocus']>>[0];

	let {
		value,
		disabled = false,
		children,
		class: className,
		style,
		onclick,
		onfocus,
		...nativeAttributes
	}: Props = $props();

	const tabs = useTabsContext();

	const rootId = $derived(tabs.getRootId());
	const tabId = $derived(tabs.getTabId(value));
	const panelId = $derived(tabs.getPanelId(value));
	const selected = $derived(
		!disabled && tabs.getValue() === value
	);

	function handleClick(event: TabClickEvent) {
		if (!disabled) {
			tabs.requestValue(value);
		}

		onclick?.(event);
	}

	function handleFocus(event: TabFocusEvent) {
		if (
			!disabled &&
			tabs.getActivation() === 'automatic' &&
			tabs.getValue() !== value
		) {
			tabs.requestValue(value);
		}

		onfocus?.(event);
	}
</script>

<button
	{...nativeAttributes}
	id={tabId}
	type="button"
	role="tab"
	disabled={disabled}
	aria-selected={selected ? 'true' : 'false'}
	aria-controls={panelId}
	tabindex={selected ? 0 : -1}
	data-giu-tabs-root={rootId}
	data-giu-tab-value={value}
	class={['giu-tab', className]}
	{style}
	onclick={handleClick}
	onfocus={handleFocus}
>
	{@render children()}
</button>

<style>
	.giu-tab {
		box-sizing: border-box;
		display: inline-flex;
		min-height: var(--giu-tabs-tab-min-height, 2.5rem);
		align-items: center;
		justify-content: center;
		gap: var(--giu-tabs-tab-gap, 0.375rem);
		margin: 0;
		padding: var(--giu-tabs-tab-padding, 0.5rem 0.75rem);
		border: var(--giu-tabs-tab-border-width, 1px) solid
			var(--giu-tabs-tab-border-color, transparent);
		border-radius: var(--giu-tabs-tab-border-radius, 0.375rem);
		color: var(--giu-tabs-tab-color, #202020);
		background: var(--giu-tabs-tab-background, transparent);
		font: inherit;
		font-weight: var(--giu-tabs-tab-font-weight, 500);
		line-height: 1.25;
		cursor: pointer;
	}

	.giu-tab:hover:not(:disabled) {
		background: var(--giu-tabs-tab-hover-background, #f2f2f2);
	}

	.giu-tab[aria-selected='true'] {
		border-color: var(--giu-tabs-selected-border-color, #1559a6);
		color: var(--giu-tabs-selected-color, #0f477f);
		background: var(--giu-tabs-selected-background, #eef5fc);
		font-weight: var(--giu-tabs-selected-font-weight, 600);
	}

	.giu-tab:focus-visible {
		outline: var(--giu-tabs-focus-width, 3px) solid
			var(--giu-tabs-focus-color, #1559a6);
		outline-offset: var(--giu-tabs-focus-offset, 2px);
	}

	.giu-tab:disabled {
		cursor: not-allowed;
		opacity: var(--giu-tabs-disabled-opacity, 0.6);
	}

	@media (forced-colors: active) {
		.giu-tab[aria-selected='true'] {
			border-color: Highlight;
		}

		.giu-tab:focus-visible {
			outline-color: Highlight;
		}

		.giu-tab:disabled {
			color: GrayText;
			opacity: 1;
		}
	}
</style>
