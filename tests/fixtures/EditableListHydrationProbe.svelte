<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions
	} from '../../src/lib/studio/index.js';

	let moveCount = $state(0);
	let positionText = $state('Hero image, position 1 of 3');
	const positionContext = $derived({
		id: 'hero-image-reorder-context',
		text: positionText
	});
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
			{positionContext}
			onMoveUp={() => moveCount += 1}
			onMoveDown={() => {
				moveCount += 1;
				positionText = 'Hero image, position 2 of 3';
			}}
		/>
	{/snippet}

	<EditableList legend="Gallery" isEmpty={false} {empty}>
		<EditableListRow position={1} {fields} {actions} />
	</EditableList>
</div>
