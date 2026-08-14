<script lang="ts">
	import IconButton from '../../src/lib/studio/IconButton.svelte';

	let count = $state(0);
	let variant = $state<'primary' | 'secondary'>('primary');
	let size = $state<'default' | 'compact'>('default');
</script>

{#snippet editIcon()}
	<svg viewBox="0 0 16 16" width="16" height="16" aria-label="Ignored edit geometry">
		<path d="M2 12l2 2 9-9-2-2z"></path>
	</svg>
{/snippet}

{#snippet unavailableIcon()}
	<span>×</span>
{/snippet}

{#snippet presentationIcon()}
	<span>↔</span>
{/snippet}

<div data-testid="icon-button-probe" data-count={count}>
	<IconButton
		label="Edit item"
		icon={editIcon}
		name="intent"
		value="edit"
		aria-describedby="icon-button-help"
		aria-pressed="false"
		data-consumer="forwarded"
		class="consumer-class"
		style="--giu-icon-button-border-radius: 1rem"
		{variant}
		{size}
		onclick={() => count += 1}
	/>
	<span id="icon-button-help">Edits the current item</span>

	<IconButton
		label="Unavailable action"
		icon={unavailableIcon}
		disabled
		onclick={() => count += 100}
	/>

	<IconButton
		label="Change presentation"
		icon={presentationIcon}
		variant="secondary"
		onclick={() => {
			variant = variant === 'primary' ? 'secondary' : 'primary';
			size = size === 'default' ? 'compact' : 'default';
		}}
	/>

	<IconButton
		label="Remove item"
		icon={unavailableIcon}
		variant="danger"
		size="compact"
	/>
</div>
