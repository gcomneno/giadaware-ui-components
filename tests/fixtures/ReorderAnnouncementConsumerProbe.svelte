<script lang="ts">
	import { tick } from 'svelte';
	import {
		EditableList,
		EditableListRow,
		ReorderActions,
		ReorderAnnouncement
	} from '../../src/lib/studio/index.js';

	type Item = {
		id: string;
		label: string;
	};

	let items = $state<Item[]>([
		{ id: 'hero', label: 'Hero image' },
		{ id: 'detail', label: 'Detail image' }
	]);
	let eventKey = $state<number | null>(null);
	let message = $state<string | null>(null);
	let confirmedCount = $state(0);
	let failedCount = $state(0);

	function confirmMove(index: number, direction: -1 | 1) {
		const target = index + direction;

		if (target < 0 || target >= items.length) {
			failedCount += 1;
			return;
		}

		const nextItems = [...items];
		const [item] = nextItems.splice(index, 1);
		nextItems.splice(target, 0, item);
		items = nextItems;
		confirmedCount += 1;
		message = 'Image moved';
		eventKey = confirmedCount;
	}

	async function rapidConfirmedMoves() {
		message = 'Older move';
		eventKey = 100;
		await tick();
		message = 'Newest move';
		eventKey = 101;
	}
</script>

<div
	data-testid="reorder-announcement-consumer-probe"
	data-confirmed-count={confirmedCount}
	data-failed-count={failedCount}
>
	{#snippet empty()}
		<p>No images.</p>
	{/snippet}

	<EditableList legend="Gallery images" isEmpty={items.length === 0} {empty}>
		{#each items as item, index (item.id)}
			{#snippet fields()}
				<span>{item.label}</span>
			{/snippet}

			{#snippet actions()}
				<ReorderActions
					moveUpLabel={`Move ${item.label} up`}
					moveDownLabel={`Move ${item.label} down`}
					canMoveUp={index > 0}
					canMoveDown={index < items.length - 1}
					onMoveUp={() => confirmMove(index, -1)}
					onMoveDown={() => confirmMove(index, 1)}
				/>
			{/snippet}

			<EditableListRow position={index + 1} {fields} {actions} />
		{/each}
	</EditableList>

	<p data-testid="visible-confirmation">Image moved</p>
	<ReorderAnnouncement {message} {eventKey} />
	<button type="button" onclick={rapidConfirmedMoves}>Rapid confirmed moves</button>
</div>
