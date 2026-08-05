<script lang="ts">
	import type { EditableListRowProps as Props } from './editable-list-row.js';

	let { position, fields, actions, class: className, style }: Props = $props();
	const normalizedPosition = $derived(
		typeof position === 'number' && Number.isFinite(position) && Number.isInteger(position) && position >= 1
			? position
			: 1
	);
</script>

<li class={['giu-editable-list-row', className]} {style}>
	<span class="giu-editable-list-row__position" aria-hidden="true">{normalizedPosition}</span>
	<div class="giu-editable-list-row__fields">{@render fields()}</div>
	{#if actions}
		<div class="giu-editable-list-row__actions">{@render actions()}</div>
	{/if}
</li>

<style>
	.giu-editable-list-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: start; gap: var(--giu-editable-list-row-gap, 0.75rem); box-sizing: border-box; min-width: 0; padding: var(--giu-editable-list-row-padding, 0.75rem); border: var(--giu-editable-list-row-border, 1px solid #d0d0d0); border-radius: var(--giu-editable-list-row-border-radius, 0.5rem); background: var(--giu-editable-list-row-background, #ffffff); }
	.giu-editable-list-row__position { display: grid; min-width: var(--giu-editable-list-row-position-min-width, 1.5rem); min-height: var(--giu-editable-list-row-position-min-height, 2.75rem); place-items: center; color: var(--giu-editable-list-row-position-color, #505050); font-weight: var(--giu-editable-list-row-position-weight, 600); }
	.giu-editable-list-row__fields { min-width: 0; }
	.giu-editable-list-row__actions { display: flex; flex: 0 0 auto; align-items: center; }
	@media (max-width: 40rem) { .giu-editable-list-row { grid-template-columns: auto minmax(0, 1fr); } .giu-editable-list-row__actions { grid-column: 2; } }
</style>
