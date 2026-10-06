<script lang="ts">
	import MenuButton from '../../src/lib/studio/MenuButton.svelte';
	import MenuItem from '../../src/lib/studio/MenuItem.svelte';

	let actionCount = $state(0);
</script>

<div
	data-testid="menu-button-hydration-probe"
	data-action-count={actionCount}
>
	<MenuButton>
		{#snippet trigger()}
			Hydration actions
		{/snippet}

		<MenuItem
			data-testid="menu-button-hydration-item"
			onclick={() => actionCount += 1}
		>
			Run
		</MenuItem>
	</MenuButton>
</div>
