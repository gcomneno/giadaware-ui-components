<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions
	} from '../../src/lib/studio/index.js';
	import type { EditableListRowDragCandidate } from '../../src/lib/studio/index.js';

	let started = $state(0);
	let dropped = $state(0);
	let candidate = $state<EditableListRowDragCandidate | null>(null);

	const drag = $derived({
		id: 'hero',
		label: 'Drag hero image',
		candidate,
		onDragStart: () => started += 1,
		onDrop: () => dropped += 1
	});

	const targetDrag = $derived({
		id: 'detail',
		label: 'Drag detail image',
		disabled: true,
		candidate,
		onDrop: () => dropped += 1
	});
</script>

<div
	data-testid="editable-list-drag-hydration-probe"
	data-started={started}
	data-dropped={dropped}
>
	{#snippet fields()}
		<label>Hero image <input name="hero" /></label>
	{/snippet}

	{#snippet actions()}
		<ReorderActions
			moveUpLabel="Move hero image up"
			moveDownLabel="Move hero image down"
			canMoveUp={false}
			onMoveUp={() => {}}
			onMoveDown={() => candidate = { sourceId: 'hero', targetId: 'detail', position: 'after' }}
		/>
	{/snippet}

	{#snippet targetFields()}
		<label>Detail image <input name="detail" /></label>
	{/snippet}

	<EditableList legend="Gallery" isEmpty={false}>
		<EditableListRow position={1} {fields} {actions} {drag} />
		<EditableListRow position={2} fields={targetFields} drag={targetDrag} />
	</EditableList>
</div>
