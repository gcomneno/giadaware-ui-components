<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions
	} from '../../src/lib/studio/index.js';

	let moveCount = $state(0);
</script>

<div data-testid="editable-list-hydration-probe" data-move-count={moveCount}>
	{#snippet empty()}
		<p>No images yet.</p>
	{/snippet}

	{#snippet fields()}
		<label>Hero image <input name="hero" /></label>
	{/snippet}

	{#snippet actions()}
		<ReorderActions
			moveUpLabel="Move hero image up"
			moveDownLabel="Move hero image down"
			canMoveUp={false}
			canMoveDown={true}
			onMoveUp={() => moveCount += 1}
			onMoveDown={() => moveCount += 1}
		/>
	{/snippet}

	<EditableList legend="Gallery" isEmpty={false} {empty}>
		<EditableListRow position={1} {fields} {actions} />
	</EditableList>
</div>
