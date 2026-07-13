<script lang="ts">
	import FormStatus from '../../src/lib/FormStatus.svelte';
</script>

<section
	data-testid="form-status-accessibility-probe"
	aria-label="Form status examples"
>
	<FormStatus message="Saved" tone="success" />
	<FormStatus message="Save failed" tone="error" />
	<FormStatus message="Review required" tone="warning" />
	<FormStatus message="Draft ready" tone="info" />
</section>
