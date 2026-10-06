<script lang="ts">
	import MenuButton from '../../src/lib/studio/MenuButton.svelte';
	import MenuItem from '../../src/lib/studio/MenuItem.svelte';
	import MenuSeparator from '../../src/lib/studio/MenuSeparator.svelte';

	type Props = {
		id?: string;
		disabled?: boolean;
	};

	let {
		id = 'actions-menu',
		disabled = false
	}: Props = $props();

	let editCount = $state(0);
	let deleteCount = $state(0);
	let itemKeydownCount = $state(0);
</script>

<div
	data-testid="menu-button-probe"
	data-edit-count={editCount}
	data-delete-count={deleteCount}
	data-item-keydown-count={itemKeydownCount}
>
	<MenuButton {id} {disabled}>
		{#snippet trigger()}
			Actions
		{/snippet}

		<MenuItem
			data-testid="menu-item-edit"
			onclick={() => editCount += 1}
			onkeydown={() => itemKeydownCount += 1}
		>
			Edit
		</MenuItem>

		<MenuItem
			data-testid="menu-item-disabled"
			disabled
		>
			Disabled
		</MenuItem>

		<MenuSeparator data-testid="menu-separator" />

		<MenuItem
			data-testid="menu-item-delete"
			onclick={() => deleteCount += 1}
			onkeydown={() => itemKeydownCount += 1}
		>
			Delete
		</MenuItem>
	</MenuButton>

	<button
		type="button"
		data-testid="outside-button"
	>
		Outside
	</button>
</div>
