<script lang="ts">
	import Tooltip from '../../src/lib/studio/Tooltip.svelte';

	import type {
		TooltipTriggerProps
	} from '../../src/lib/studio/tooltip.js';

	type Props = {
		id?: string;
		label?: string;
	};

	let {
		id = 'help-tooltip',
		label = 'Helpful information'
	}: Props = $props();

	let focusCount = $state(0);
	let blurCount = $state(0);
	let pointerEnterCount = $state(0);
	let pointerLeaveCount = $state(0);
	let keydownCount = $state(0);

	function composeFocus(
		props: TooltipTriggerProps,
		event: FocusEvent
	) {
		props.onfocus(event);
		focusCount += 1;
	}

	function composeBlur(
		props: TooltipTriggerProps,
		event: FocusEvent
	) {
		props.onblur(event);
		blurCount += 1;
	}

	function composePointerEnter(
		props: TooltipTriggerProps,
		event: PointerEvent
	) {
		props.onpointerenter(event);
		pointerEnterCount += 1;
	}

	function composePointerLeave(
		props: TooltipTriggerProps,
		event: PointerEvent
	) {
		props.onpointerleave(event);
		pointerLeaveCount += 1;
	}

	function composeKeydown(
		props: TooltipTriggerProps,
		event: KeyboardEvent
	) {
		props.onkeydown(event);
		keydownCount += 1;
	}
</script>

<div
	data-testid="tooltip-probe"
	data-focus-count={focusCount}
	data-blur-count={blurCount}
	data-pointer-enter-count={pointerEnterCount}
	data-pointer-leave-count={pointerLeaveCount}
	data-keydown-count={keydownCount}
>
	<Tooltip {id}>
		{#snippet trigger(props)}
			<button
				type="button"
				data-testid="tooltip-trigger"
				aria-describedby={props['aria-describedby']}
				onfocus={(event) => composeFocus(props, event)}
				onblur={(event) => composeBlur(props, event)}
				onpointerenter={(event) => composePointerEnter(props, event)}
				onpointerleave={(event) => composePointerLeave(props, event)}
				onkeydown={(event) => composeKeydown(props, event)}
			>
				Help
			</button>
		{/snippet}

		<span data-testid="tooltip-content">{label}</span>
	</Tooltip>
</div>
