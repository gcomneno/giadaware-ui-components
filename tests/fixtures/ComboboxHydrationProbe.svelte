<script lang="ts">
	import Combobox from '../../src/lib/studio/Combobox.svelte';

	let query = $state('Alpha');
	let value = $state<string | null>('alpha');
	let queryRequests = $state(0);
	let valueRequests = $state(0);

	const options = [
		{
			value: 'alpha',
			label: 'Alpha'
		},
		{
			value: 'beta',
			label: 'Beta'
		},
		{
			value: 'gamma',
			label: 'Gamma'
		}
	];

	function handleQueryChange(nextQuery: string): void {
		query = nextQuery;
		queryRequests += 1;
	}

	function handleValueChange(nextValue: string): void {
		value = nextValue;
		valueRequests += 1;
	}
</script>

<div
	data-testid="combobox-hydration-probe"
	data-query={query}
	data-value={value ?? 'none'}
	data-query-requests={queryRequests}
	data-value-requests={valueRequests}
>
	<label for="hydration-combobox-input">
		Hydration city
	</label>

	<Combobox
		id="hydration-combobox"
		{query}
		{value}
		{options}
		onquerychange={handleQueryChange}
		onvaluechange={handleValueChange}
	/>
</div>
