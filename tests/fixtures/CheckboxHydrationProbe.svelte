<script lang="ts">
	import Checkbox from '../../src/lib/studio/Checkbox.svelte';

	let checked = $state(true);
	let count = $state(0);
</script>

<div
	data-testid="checkbox-hydration-probe"
	data-checked={checked}
	data-count={count}
>
	<label>
		<Checkbox
			bind:checked
			name="hydrated"
			value="yes"
			data-testid="hydrated-checkbox"
			onchange={() => count += 1}
		/>
		Hydrated checkbox
	</label>
	<label><Checkbox name="hydrated-secondary" /> Secondary checkbox</label>
</div>
