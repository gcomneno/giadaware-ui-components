<script lang="ts">
	import { ReorderActions } from '../../src/lib/studio/index.js';

	let firstMoves = $state(0);
	let secondMoves = $state(0);
</script>

<div
	data-testid="reorder-actions-position-context-probe"
	data-first-moves={firstMoves}
	data-second-moves={secondMoves}
>
	<ReorderActions
		moveUpLabel="Move item up"
		moveDownLabel="Move item down"
		canMoveUp={false}
		positionContext={{
			id: 'gallery-hero-reorder-context',
			text: 'Hero image, position 1 of 2'
		}}
		onMoveUp={() => firstMoves += 1}
		onMoveDown={() => firstMoves += 1}
	/>
	<ReorderActions
		moveUpLabel="Move item up"
		moveDownLabel="Move item down"
		canMoveDown={false}
		positionContext={{
			id: 'gallery-detail-reorder-context',
			text: 'Detail image, position 2 of 2'
		}}
		onMoveUp={() => secondMoves += 1}
		onMoveDown={() => secondMoves += 1}
	/>
</div>
