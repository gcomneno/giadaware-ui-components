<script lang="ts">
	import type { ReorderActionsProps as Props } from './reorder-actions.js';

	let { moveUpLabel, moveDownLabel, onMoveUp, onMoveDown, canMoveUp = true, canMoveDown = true, positionContext, size = 'default', class: className, style }: Props = $props();
	const normalizedSize = $derived(size === 'compact' ? 'compact' : 'default');
	const validPositionContext = $derived.by(() => {
		if (
			!positionContext ||
			typeof positionContext.id !== 'string' ||
			typeof positionContext.text !== 'string'
		) {
			return null;
		}

		if (
			!positionContext.id.trim() ||
			/\s/.test(positionContext.id) ||
			!positionContext.text.trim()
		) {
			return null;
		}

		return positionContext;
	});
</script>

<div class={['giu-reorder-actions', `giu-reorder-actions--${normalizedSize}`, className]} {style} data-giu-size={normalizedSize}>
	{#if validPositionContext}
		<span id={validPositionContext.id} class="giu-reorder-actions__position-context">{validPositionContext.text}</span>
	{/if}
	<button type="button" aria-label={moveUpLabel} aria-describedby={validPositionContext?.id} disabled={!canMoveUp} onclick={() => { if (canMoveUp) onMoveUp(); }}>↑</button>
	<button type="button" aria-label={moveDownLabel} aria-describedby={validPositionContext?.id} disabled={!canMoveDown} onclick={() => { if (canMoveDown) onMoveDown(); }}>↓</button>
</div>

<style>
	.giu-reorder-actions { display: inline-flex; gap: var(--giu-reorder-actions-gap, 0.5rem); }
	.giu-reorder-actions__position-context { position: absolute; width: var(--giu-reorder-actions-description-size, 1px); height: var(--giu-reorder-actions-description-size, 1px); margin: var(--giu-reorder-actions-description-margin, -1px); padding: 0; border: 0; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
	.giu-reorder-actions button { display: inline-grid; width: var(--giu-reorder-actions-control-size, 2.75rem); min-width: var(--giu-reorder-actions-control-size, 2.75rem); min-height: var(--giu-reorder-actions-control-size, 2.75rem); place-items: center; box-sizing: border-box; padding: var(--giu-reorder-actions-padding, 0.375rem); border: var(--giu-reorder-actions-border, 1px solid #5f5f5f); border-radius: var(--giu-reorder-actions-border-radius, 0.5rem); color: var(--giu-reorder-actions-color, #202020); background: var(--giu-reorder-actions-background, #ffffff); font: inherit; font-size: var(--giu-reorder-actions-arrow-size, 1.25rem); line-height: 1; cursor: pointer; }
	.giu-reorder-actions--compact button { width: var(--giu-reorder-actions-compact-control-size, 2.5rem); min-width: var(--giu-reorder-actions-compact-control-size, 2.5rem); min-height: var(--giu-reorder-actions-compact-control-size, 2.5rem); }
	.giu-reorder-actions button:hover:not(:disabled) { background: var(--giu-reorder-actions-hover-background, #eeeeee); }
	.giu-reorder-actions button:focus-visible { outline: var(--giu-reorder-actions-focus-width, 3px) solid var(--giu-reorder-actions-focus-color, #1559a6); outline-offset: var(--giu-reorder-actions-focus-offset, 2px); }
	.giu-reorder-actions button:disabled { opacity: var(--giu-reorder-actions-disabled-opacity, 0.55); cursor: not-allowed; }
</style>
