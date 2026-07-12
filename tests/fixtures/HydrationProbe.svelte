<script lang="ts">
	let count = $state(1);
</script>

<button
	type="button"
	data-testid="hydration-probe"
	onclick={() => {
		count += 1;
	}}
>
	Count: {count}
</button>
