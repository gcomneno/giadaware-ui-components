<script lang="ts">
	import Button from '../../src/lib/studio/Button.svelte';

	let count = $state(0);
	let variant = $state<'primary' | 'secondary'>('primary');
	let size = $state<'default' | 'compact'>('default');
</script>

{#snippet saveLeading()}
	<span data-testid="button-leading">Leading decoration</span>
{/snippet}

{#snippet saveTrailing()}
	<span data-testid="button-trailing">Trailing decoration</span>
{/snippet}

{#snippet longLeading()}
	<span data-testid="long-button-leading">L</span>
{/snippet}

{#snippet longTrailing()}
	<span data-testid="long-button-trailing">T</span>
{/snippet}

<div data-testid="button-probe" data-count={count} style="width: 12rem">
	<Button
		leading={saveLeading}
		trailing={saveTrailing}
		name="intent"
		value="save"
		aria-describedby="button-help"
		data-consumer="forwarded"
		class="consumer-class"
		style="--giu-button-border-radius: 1rem; width: 100%"
		{variant}
		{size}
		onclick={() => count += 1}
	>Save changes</Button>
	<span id="button-help">Saves the document</span>
	<Button disabled onclick={() => count += 100}>Disabled action</Button>
	<Button variant="secondary" onclick={() => { variant = variant === 'primary' ? 'secondary' : 'primary'; size = size === 'default' ? 'compact' : 'default'; }}>Change presentation</Button>
	<Button variant="danger" size="compact">Remove item</Button>
	<Button
		class="long-label"
		leading={longLeading}
		trailing={longTrailing}
	>A deliberately long button label that must wrap safely inside a narrow container</Button>
</div>
