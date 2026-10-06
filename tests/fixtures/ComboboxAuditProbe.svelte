<script lang="ts">
	import Combobox from '../../src/lib/studio/Combobox.svelte';

	let query = $state('Beta');
	let value = $state<string | null>('beta');
	let disabled = $state(false);
	let acceptQuery = $state(false);
	let queryRequests = $state(0);
	let valueRequests = $state(0);
	let clickCount = $state(0);

	const options = [
		{ value: 'alpha', label: 'Alpha' },
		{ value: 'beta', label: 'Beta' },
		{ value: 'gamma', label: 'Gamma' }
	];

	function handleQueryChange(next: string): void {
		queryRequests += 1;

		if (acceptQuery) {
			query = next;
		}
	}

	function handleValueChange(next: string): void {
		value = next;
		valueRequests += 1;
	}
</script>

<div
	data-testid="combobox-audit-probe"
	data-query={query}
	data-value={value ?? 'none'}
	data-disabled={disabled}
	data-query-requests={queryRequests}
	data-value-requests={valueRequests}
	data-click-count={clickCount}
>
	<label for="audit-combobox-input">Audit city</label>

	<Combobox
		id="audit-combobox"
		{query}
		{value}
		{options}
		{disabled}
		onquerychange={handleQueryChange}
		onvaluechange={handleValueChange}
		onclick={() => clickCount += 1}
	/>

	<button
		type="button"
		data-testid="combobox-audit-accept-query"
		onclick={() => acceptQuery = true}
	>
		Accept query
	</button>

	<button
		type="button"
		data-testid="combobox-audit-disable"
		onclick={() => disabled = true}
	>
		Disable
	</button>
</div>
