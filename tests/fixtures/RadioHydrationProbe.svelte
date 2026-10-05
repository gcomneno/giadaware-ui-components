<script lang="ts">
	import Radio from '../../src/lib/studio/Radio.svelte';

	let selected = $state('primary');
	let count = $state(0);
</script>

<div
	data-testid="radio-hydration-probe"
	data-selected={selected}
	data-count={count}
>
	<label>
		<Radio
			bind:group={selected}
			name="hydrated"
			value="primary"
			data-testid="hydrated-radio"
			onchange={() => count += 1}
		/>
		Primary radio
	</label>

	<label>
		<Radio
			bind:group={selected}
			name="hydrated"
			value="secondary"
			onchange={() => count += 1}
		/>
		Secondary radio
	</label>
</div>
