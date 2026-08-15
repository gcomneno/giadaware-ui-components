<script lang="ts">
	import StatusNotice from '../../src/lib/StatusNotice.svelte';
</script>

{#snippet body()}
	<p>Body content</p>
{/snippet}

{#snippet actions()}
	<button type="button">Open details</button>
{/snippet}

<section
	data-testid="status-notice-accessibility-probe"
	aria-label="Status notice examples"
>
	<StatusNotice title="Static notice" />
	<StatusNotice title="Polite notice" announcement="polite" {actions}>
		{@render body()}
	</StatusNotice>
	<StatusNotice title="Assertive notice" announcement="assertive" {actions}>
		{@render body()}
	</StatusNotice>
	<StatusNotice
		title="Dismissible notice"
		onDismiss={() => undefined}
		closeLabel="Dismiss notice"
	/>
</section>
