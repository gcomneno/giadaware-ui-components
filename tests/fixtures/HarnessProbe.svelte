<script lang="ts">
	let { message = 'Harness ready' } = $props<{
		message?: string;
	}>();
</script>

<section
	data-testid="harness-probe"
	aria-labelledby="harness-probe-title"
>
	<h1 id="harness-probe-title">{message}</h1>
</section>
