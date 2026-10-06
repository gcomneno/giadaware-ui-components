<script lang="ts">
	import type {
		TooltipProps as Props,
		TooltipTriggerProps
	} from './tooltip.js';

	let {
		trigger,
		children,
		id,
		class: className,
		style
	}: Props = $props();

	let triggerFocused = $state(false);
	let triggerHovered = $state(false);
	let tooltipHovered = $state(false);
	let dismissed = $state(false);

	const generatedId = $props.id();
	const tooltipId = $derived(id ?? `${generatedId}-tooltip`);

	const visible = $derived(
		!dismissed &&
		(
			triggerFocused ||
			triggerHovered ||
			tooltipHovered
		)
	);

	$effect(() => {
		if (
			!triggerFocused &&
			!triggerHovered &&
			!tooltipHovered
		) {
			dismissed = false;
		}
	});

	function handleFocus(_event: FocusEvent): void {
		triggerFocused = true;
		dismissed = false;
	}

	function handleBlur(_event: FocusEvent): void {
		triggerFocused = false;
	}

	function handlePointerEnter(_event: PointerEvent): void {
		triggerHovered = true;
		dismissed = false;
	}

	function handlePointerLeave(event: PointerEvent): void {
		triggerHovered = false;

		const related = event.relatedTarget;

		if (
			related instanceof HTMLElement &&
			related.id === tooltipId
		) {
			tooltipHovered = true;
		}
	}

	function handleTooltipPointerEnter(): void {
		tooltipHovered = true;
	}

	function handleTooltipPointerLeave(event: PointerEvent): void {
		tooltipHovered = false;

		const related = event.relatedTarget;

		if (
			related instanceof HTMLElement &&
			related.getAttribute('aria-describedby') === tooltipId
		) {
			triggerHovered = true;
		}
	}

	function dismissOnEscape(event: KeyboardEvent): void {
		if (event.key === 'Escape' && visible) {
			dismissed = true;
		}
	}

	function handleKeydown(event: KeyboardEvent): void {
		dismissOnEscape(event);
	}

	const triggerProps: TooltipTriggerProps = $derived({
		'aria-describedby': tooltipId,
		onfocus: handleFocus,
		onblur: handleBlur,
		onpointerenter: handlePointerEnter,
		onpointerleave: handlePointerLeave,
		onkeydown: handleKeydown
	});
</script>

<svelte:window onkeydown={dismissOnEscape} />

{@render trigger(triggerProps)}

<div
	id={tooltipId}
	role="tooltip"
	hidden={!visible}
	class={['giu-tooltip', className]}
	{style}
	onpointerenter={handleTooltipPointerEnter}
	onpointerleave={handleTooltipPointerLeave}
>
	{@render children()}
</div>

<style>
	.giu-tooltip {
		box-sizing: border-box;
		max-width: var(--giu-tooltip-max-width, 20rem);
		padding: var(--giu-tooltip-padding, 0.375rem 0.5rem);
		border: var(--giu-tooltip-border-width, 1px) solid
			var(--giu-tooltip-border-color, #5f5f5f);
		border-radius: var(--giu-tooltip-border-radius, 0.25rem);
		color: var(--giu-tooltip-color, #ffffff);
		background: var(--giu-tooltip-background, #202020);
		font-size: var(--giu-tooltip-font-size, 0.875rem);
		line-height: var(--giu-tooltip-line-height, 1.35);
		box-shadow: var(
			--giu-tooltip-shadow,
			0 0.125rem 0.375rem rgb(0 0 0 / 0.18)
		);
	}

	.giu-tooltip[hidden] {
		display: none;
	}

	@media (forced-colors: active) {
		.giu-tooltip {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
			box-shadow: none;
		}
	}
</style>
