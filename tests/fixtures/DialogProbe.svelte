<script lang="ts">
	import { tick } from 'svelte';

	import Dialog from '../../src/lib/studio/Dialog.svelte';

	type FocusMode =
		| 'autofocus'
		| 'autofocus-static'
		| 'ordinary'
		| 'empty';

	type Props = {
		focusMode?: FocusMode;
		disconnectTriggerOnClose?: boolean;
	};

	let {
		focusMode = 'autofocus',
		disconnectTriggerOnClose = false
	}: Props = $props();

	let open = $state(false);
	let requests = $state(0);
	let rejectNextClose = $state(false);
	let renderTrigger = $state(true);
	let cancelCallbacks = $state(0);
	let closeCallbacks = $state(0);
	let clickCallbacks = $state(0);
	let contentClicks = $state(0);
	let lastCancelDefaultPrevented = $state(false);
	let lastClickTarget = $state('none');

	async function closeAndReopen(): Promise<void> {
		open = false;
		await tick();

		open = true;
		await tick();
	}

	function handleOpenChange(next: boolean) {
		requests += 1;

		if (!next && rejectNextClose) {
			rejectNextClose = false;
			return;
		}

		if (!next && disconnectTriggerOnClose) {
			renderTrigger = false;
		}

		open = next;
	}

	function handleCancel(event: Event) {
		cancelCallbacks += 1;
		lastCancelDefaultPrevented = event.defaultPrevented;
	}

	function handleClose() {
		closeCallbacks += 1;
	}

	function handleClick(event: MouseEvent) {
		clickCallbacks += 1;

		if (event.target instanceof HTMLElement) {
			lastClickTarget = event.target.dataset.testid ?? event.target.tagName.toLowerCase();
			return;
		}

		lastClickTarget = 'unknown';
	}
</script>

<div
	data-testid="dialog-probe-root"
	data-open={open}
	data-requests={requests}
	data-cancel-callbacks={cancelCallbacks}
	data-close-callbacks={closeCallbacks}
	data-click-callbacks={clickCallbacks}
	data-content-clicks={contentClicks}
	data-last-cancel-default-prevented={lastCancelDefaultPrevented}
	data-last-click-target={lastClickTarget}
	data-trigger-rendered={renderTrigger}
>
	{#if renderTrigger}
		<button
			type="button"
			data-testid="dialog-open-trigger"
			onclick={() => open = true}
		>
			Open dialog
		</button>
	{/if}

	<button
		type="button"
		data-testid="dialog-reject-next-close"
		onclick={() => rejectNextClose = true}
	>
		Reject next close request
	</button>

	<button type="button" data-testid="fallback-candidate">
		Fallback candidate
	</button>

	<Dialog
		{open}
		onopenchange={handleOpenChange}
		aria-label="Dialog probe"
		data-testid="dialog-probe-dialog"
		oncancel={handleCancel}
		onclose={handleClose}
		onclick={handleClick}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events (test fixture verifies consumer click callback composition) -->
		<!-- svelte-ignore a11y_no_static_element_interactions (test fixture verifies consumer click callback composition) -->
		<div
			data-testid="dialog-content"
			onclick={() => contentClicks += 1}
		>
			<p>Consumer dialog body</p>

			{#if focusMode === 'autofocus'}
				<button type="button" data-testid="ordinary-before-autofocus">
					Earlier ordinary control
				</button>
				<!-- svelte-ignore a11y_autofocus (test fixture verifies Dialog autofocus priority) -->
				<input
					data-testid="autofocus-target"
					aria-label="Autofocus target"
					autofocus
				/>
				<button type="button" data-testid="ordinary-after-autofocus">
					Later ordinary control
				</button>
			{:else if focusMode === 'autofocus-static'}
				<button type="button" data-testid="ordinary-before-static-autofocus">
					Earlier ordinary control
				</button>
				<!-- svelte-ignore a11y_autofocus (regression verifies valid programmatic autofocus target) -->
				<h2
					tabindex="-1"
					autofocus
					data-testid="static-autofocus-target"
				>
					Static autofocus heading
				</h2>
			{:else if focusMode === 'ordinary'}
				<button type="button" data-testid="ordinary-first">
					First ordinary control
				</button>
				<button type="button" data-testid="ordinary-second">
					Second ordinary control
				</button>
				<button
					type="button"
					data-testid="dialog-close-reopen"
					onclick={closeAndReopen}
				>
					Close and reopen
				</button>
			{:else}
				<p data-testid="empty-dialog-copy">No focusable descendants.</p>
			{/if}
		</div>
	</Dialog>
</div>
