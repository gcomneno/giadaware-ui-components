<script lang="ts">
	import Tab from '../../src/lib/studio/Tab.svelte';
	import TabList from '../../src/lib/studio/TabList.svelte';
	import TabPanel from '../../src/lib/studio/TabPanel.svelte';
	import Tabs from '../../src/lib/studio/Tabs.svelte';

	import type {
		TabsActivation,
		TabsOrientation,
		TabsValue
	} from '../../src/lib/studio/tabs.js';

	type Props = {
		activation?: TabsActivation;
		orientation?: TabsOrientation;
		initialValue?: TabsValue;
		disabledDetails?: boolean;
		rejectSelection?: boolean;
		id?: string;
	};

	let {
		activation = 'automatic',
		orientation = 'horizontal',
		initialValue = 'overview',
		disabledDetails = false,
		rejectSelection = false,
		id = 'settings-tabs'
	}: Props = $props();

	// svelte-ignore state_referenced_locally (initialValue intentionally seeds local controlled-consumer state once)
	let value = $state(initialValue);
	let requests = $state(0);
	let keydowns = $state(0);
	let overviewClicks = $state(0);
	let overviewFocuses = $state(0);
	let logsClicks = $state(0);
	let logsFocuses = $state(0);

	function handleValueChange(next: TabsValue) {
		requests += 1;

		if (rejectSelection) {
			return;
		}

		value = next;
	}
</script>

<div
	data-testid="tabs-probe"
	data-value={value}
	data-requests={requests}
	data-keydowns={keydowns}
	data-overview-clicks={overviewClicks}
	data-overview-focuses={overviewFocuses}
	data-logs-clicks={logsClicks}
	data-logs-focuses={logsFocuses}
>
	<Tabs
		{id}
		{value}
		{activation}
		onvaluechange={handleValueChange}
		data-testid="tabs-root"
	>
		<TabList
			{orientation}
			aria-label="Settings sections"
			data-testid="tab-list"
			onkeydown={() => keydowns += 1}
		>
			<Tab
				value="overview"
				data-testid="tab-overview"
				onclick={() => overviewClicks += 1}
				onfocus={() => overviewFocuses += 1}
			>
				Overview
			</Tab>

			<Tab
				value="details"
				disabled={disabledDetails}
				data-testid="tab-details"
			>
				Details
			</Tab>

			<Tab
				value="logs"
				data-testid="tab-logs"
				onclick={() => logsClicks += 1}
				onfocus={() => logsFocuses += 1}
			>
				Logs
			</Tab>
		</TabList>

		<TabPanel value="overview" data-testid="panel-overview">
			<p>Overview panel</p>
		</TabPanel>

		<TabPanel value="details" data-testid="panel-details">
			<p>Details panel</p>
		</TabPanel>

		<TabPanel value="logs" data-testid="panel-logs">
			<p>Logs panel</p>
		</TabPanel>
	</Tabs>
</div>
