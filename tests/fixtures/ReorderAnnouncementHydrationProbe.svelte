<script lang="ts">
	import { ReorderAnnouncement } from '../../src/lib/studio/index.js';

	let eventKey = $state<string | number | null>('initial-confirmed-event');
	let message = $state<string | null>('Stale server result');
</script>

<div data-testid="reorder-announcement-hydration-probe">
	<ReorderAnnouncement
		{message}
		{eventKey}
		class="consumer-announcement"
		style="--giu-reorder-announcement-size: 2px"
	/>
	<button type="button" onclick={() => message = 'Changed stale text'}>
		Change text only
	</button>
	<button type="button" onclick={() => {
		message = 'Confirmed move after hydration';
		eventKey = 'post-hydration-confirmed-event';
	}}>
		Confirm reorder
	</button>
</div>
