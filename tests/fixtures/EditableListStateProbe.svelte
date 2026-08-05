<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions
	} from '../../src/lib/studio/index.js';

	type Image = { id: string; title: string };

	let images = $state<Image[]>([]);
	let moveCount = $state(0);

	function addImage() {
		images = [{ id: 'hero', title: 'Hero image' }];
	}

	function removeImage() {
		images = [];
	}
</script>

<form
	data-testid="editable-list-state-probe"
	data-move-count={moveCount}
	onsubmit={(event) => event.preventDefault()}
>
	{#snippet empty()}
		<p>No images yet.</p>
	{/snippet}

	<EditableList legend="Gallery" isEmpty={images.length === 0} {empty}>
		{#each images as image, index (image.id)}
			{#snippet fields()}
				<label>{image.title} <input name={image.id} /></label>
			{/snippet}
			{#snippet actions()}
				<ReorderActions
					moveUpLabel="Move image up"
					moveDownLabel="Move image down"
					canMoveUp={index > 0}
					canMoveDown={index < images.length - 1}
					onMoveUp={() => moveCount += 1}
					onMoveDown={() => moveCount += 1}
				/>
			{/snippet}
			<EditableListRow position={index + 1} {fields} {actions} />
		{/each}
	</EditableList>

	<button type="button" onclick={addImage}>Add image</button>
	<button type="button" onclick={removeImage}>Remove image</button>
</form>
