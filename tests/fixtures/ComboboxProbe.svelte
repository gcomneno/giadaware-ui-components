<script lang="ts">
	import Combobox from '../../src/lib/studio/Combobox.svelte';

	type Props = {
		disabled?: boolean;
	};

	let {
		disabled = false
	}: Props = $props();

	let query = $state('Beta');
	let value = $state<string | null>('beta');
	let queryRequests = $state(0);
	let valueRequests = $state(0);

	const options = [
		{
			value: 'alpha',
			label: 'Alpha'
		},
		{
			value: 'blocked',
			label: 'Blocked',
			disabled: true
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
		query = options.find(
			(option) => option.value === nextValue
		)?.label ?? query;
		valueRequests += 1;
	}
</script>

<div
	data-testid="combobox-probe"
	data-query={query}
	data-value={value ?? 'none'}
	data-query-requests={queryRequests}
	data-value-requests={valueRequests}
>
	<label for="cities-input">City</label>

	<Combobox
		id="cities"
		{query}
		{value}
		{options}
		onquerychange={handleQueryChange}
		onvaluechange={handleValueChange}
		{disabled}
	/>

	<button
		type="button"
		data-testid="outside-control"
	>
		Outside
	</button>
</div>
