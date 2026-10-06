<script lang="ts">
	import MenuButton from '../../src/lib/studio/MenuButton.svelte';
	import MenuItem from '../../src/lib/studio/MenuItem.svelte';

	let disabled = $state(false);
	let actionCount = $state(0);
</script>

<div
	data-testid="menu-button-dynamic-probe"
	data-disabled={disabled}
	data-action-count={actionCount}
>
	<MenuButton {disabled} id="dynamic-menu">
		{#snippet trigger()}
			Dynamic actions
		{/snippet}

		<MenuItem
			data-testid="dynamic-menu-item"
			onclick={() => actionCount += 1}
		>
			Run
		</MenuItem>
	</MenuButton>

	<button
		type="button"
		data-testid="dynamic-menu-disable"
		onclick={() => disabled = true}
	>
		Disable menu
	</button>
</div>
