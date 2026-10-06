<script lang="ts">
	import Tab from '../../src/lib/studio/Tab.svelte';
	import TabList from '../../src/lib/studio/TabList.svelte';
	import TabPanel from '../../src/lib/studio/TabPanel.svelte';
	import Tabs from '../../src/lib/studio/Tabs.svelte';

	import type { TabsValue } from '../../src/lib/studio/tabs.js';

	let value = $state<TabsValue>('overview');
	let requests = $state(0);
	let actionCount = $state(0);

	function handleValueChange(next: TabsValue) {
		requests += 1;
		value = next;
	}
</script>

<div
	data-testid="tabs-hydration-probe"
	data-value={value}
	data-requests={requests}
	data-action-count={actionCount}
>
	<Tabs
		{value}
		onvaluechange={handleValueChange}
		data-testid="tabs-hydration-root"
	>
		<TabList
			aria-label="Hydration sections"
			data-testid="tabs-hydration-list"
		>
			<Tab
				value="overview"
				data-testid="tabs-hydration-overview"
			>
				Overview
			</Tab>

			<Tab
				value="details"
				data-testid="tabs-hydration-details"
			>
				Details
			</Tab>
		</TabList>

		<TabPanel
			value="overview"
			data-testid="tabs-hydration-overview-panel"
		>
			<button
				type="button"
				data-testid="tabs-hydration-action"
				onclick={() => actionCount += 1}
			>
				Hydration action
			</button>
		</TabPanel>

		<TabPanel
			value="details"
			data-testid="tabs-hydration-details-panel"
		>
			<p>Details hydration panel</p>
		</TabPanel>
	</Tabs>
</div>
