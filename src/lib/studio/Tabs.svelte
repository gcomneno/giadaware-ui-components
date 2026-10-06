<script lang="ts">
	import {
		createPanelId,
		createTabId,
		provideTabsContext
	} from './tabs-internal.js';

	import type { TabsProps as Props } from './tabs.js';

	let {
		value,
		onvaluechange,
		activation = 'automatic',
		id,
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	const generatedId = $props.id();
	const rootId = $derived(id ?? generatedId);

	provideTabsContext({
		getValue: () => value,
		getActivation: () => activation,
		getRootId: () => rootId,
		requestValue: (nextValue) => onvaluechange(nextValue),
		getTabId: (tabValue) => createTabId(rootId, tabValue),
		getPanelId: (panelValue) => createPanelId(rootId, panelValue)
	});
</script>

<div
	{...nativeAttributes}
	id={rootId}
	class={['giu-tabs', className]}
	{style}
>
	{@render children()}
</div>

<style>
	.giu-tabs {
		box-sizing: border-box;
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: var(--giu-tabs-gap, 0.75rem);
	}
</style>
