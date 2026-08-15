<script lang="ts">
	import { onMount, tick } from 'svelte';

	import type { ReorderAnnouncementProps as Props } from './reorder-announcement.js';

	let { message, eventKey, class: className, style }: Props = $props();

	let hasHydrated = $state(false);
	let observedEventKey = $state<Props['eventKey']>(null);
	let renderedMessage = $state('');
	let announcementVersion = 0;

	onMount(() => {
		observedEventKey = eventKey;
		hasHydrated = true;
	});

	$effect(() => {
		if (!hasHydrated) {
			return;
		}

		const nextEventKey = eventKey;
		const nextMessage = message;
		const hasMessage =
			typeof nextMessage === 'string' && Boolean(nextMessage.trim());

		if (nextEventKey === null) {
			observedEventKey = null;
			announcementVersion += 1;
			renderedMessage = '';
			return;
		}

		if (nextEventKey === observedEventKey) {
			if (!hasMessage) {
				announcementVersion += 1;
				renderedMessage = '';
			}

			return;
		}

		observedEventKey = nextEventKey;
		const version = ++announcementVersion;
		renderedMessage = '';

		if (!hasMessage) {
			return;
		}

		tick().then(() => {
			if (announcementVersion === version && eventKey === nextEventKey) {
				renderedMessage = nextMessage;
			}
		});
	});
</script>

<div
	class={['giu-reorder-announcement', className]}
	{style}
	role="status"
	aria-live="polite"
	aria-atomic="true"
>
	{renderedMessage}
</div>

<style>
	.giu-reorder-announcement {
		position: absolute;
		width: var(--giu-reorder-announcement-size, 1px);
		height: var(--giu-reorder-announcement-size, 1px);
		margin: var(--giu-reorder-announcement-margin, -1px);
		padding: 0;
		border: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
