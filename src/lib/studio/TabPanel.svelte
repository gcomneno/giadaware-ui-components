<script lang="ts">
	import { useTabsContext } from './tabs-internal.js';

	import type { TabPanelProps as Props } from './tabs.js';

	let {
		value,
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	const tabs = useTabsContext();

	const tabId = $derived(tabs.getTabId(value));
	const panelId = $derived(tabs.getPanelId(value));
	const selected = $derived(tabs.getValue() === value);
</script>

<div
	{...nativeAttributes}
	id={panelId}
	role="tabpanel"
	aria-labelledby={tabId}
	hidden={!selected}
	tabindex={selected ? 0 : undefined}
	class={['giu-tab-panel', className]}
	{style}
>
	{@render children()}
</div>

<style>
	.giu-tab-panel {
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-tabs-panel-padding, 0.75rem 0);
		color: var(--giu-tabs-panel-color, inherit);
		background: var(--giu-tabs-panel-background, transparent);
	}

	.giu-tab-panel:focus-visible {
		outline: var(--giu-tabs-focus-width, 3px) solid
			var(--giu-tabs-focus-color, #1559a6);
		outline-offset: var(--giu-tabs-focus-offset, 2px);
	}

	@media (forced-colors: active) {
		.giu-tab-panel:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
