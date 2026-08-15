<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions,
		ReorderAnnouncement
	} from '../../src/lib/studio/index.js';
	import type { EditableListRowDragCandidate } from '../../src/lib/studio/index.js';

	let started = $state(0);
	let candidates = $state(0);
	let drops = $state(0);
	let cancels = $state(0);
	let up = $state(0);
	let down = $state(0);
	let submitted = $state(0);
	let candidate = $state<EditableListRowDragCandidate | null>(null);
	let droppedCandidate = $state<EditableListRowDragCandidate | null>(null);

	const firstDrag = $derived({
		id: 'hero',
		label: 'Drag hero image',
		candidate,
		onDragStart: () => started += 1,
		onDragCandidate: () => candidates += 1,
		onDrop: (nextCandidate: EditableListRowDragCandidate) => {
			droppedCandidate = nextCandidate;
			drops += 1;
		},
		onDragCancel: () => cancels += 1
	});
</script>

<form
	data-testid="editable-list-drag-probe"
	data-started={started}
	data-candidates={candidates}
	data-drops={drops}
	data-cancels={cancels}
	data-up={up}
	data-down={down}
	data-submitted={submitted}
	data-drop-source={droppedCandidate?.sourceId}
	data-drop-target={droppedCandidate?.targetId}
	data-drop-position={droppedCandidate?.position}
	onsubmit={(event) => {
		event.preventDefault();
		submitted += 1;
	}}
>
	{#snippet firstFields()}<label>Hero image <input name="hero" /></label>{/snippet}
	{#snippet secondFields()}<label>Detail image <input name="detail" /></label>{/snippet}
	{#snippet firstActions()}
		<ReorderActions
			moveUpLabel="Move hero image up"
			moveDownLabel="Move hero image down"
			canMoveUp={false}
			onMoveUp={() => up += 1}
			onMoveDown={() => down += 1}
		/>
	{/snippet}
	{#snippet secondActions()}
		<ReorderActions
			moveUpLabel="Move detail image up"
			moveDownLabel="Move detail image down"
			canMoveDown={false}
			onMoveUp={() => up += 1}
			onMoveDown={() => down += 1}
		/>
	{/snippet}

	<button type="button" data-testid="candidate-before" onclick={() => candidate = { sourceId: 'hero', targetId: 'detail', position: 'before' }}>Before</button>
	<button type="button" data-testid="candidate-after" onclick={() => candidate = { sourceId: 'hero', targetId: 'detail', position: 'after' }}>After</button>
	<button type="button" data-testid="candidate-clear" onclick={() => candidate = null}>Clear</button>

	<EditableList legend="Gallery images" isEmpty={false}>
		<EditableListRow position={1} fields={firstFields} actions={firstActions} drag={firstDrag} />
		<EditableListRow
			position={2}
			fields={secondFields}
			actions={secondActions}
			drag={{
				id: 'detail',
				label: 'Drag detail image',
				disabled: true,
				candidate,
				onDrop: () => drops += 1
			}}
		/>
	</EditableList>

	<ReorderAnnouncement message={null} eventKey={null} />
</form>
