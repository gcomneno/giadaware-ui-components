<script lang="ts">
	import type { EditableListProps as Props } from './editable-list.js';

	let {
		legend,
		description,
		empty,
		children,
		isEmpty,
		addAction,
		class: className,
		style
	}: Props = $props();
</script>

<fieldset class={['giu-editable-list', className]} {style}>
	<legend class="giu-editable-list__legend">{legend}</legend>

	{#if description}
		<div class="giu-editable-list__description">{@render description()}</div>
	{/if}

	{#if isEmpty === true}
		{#if empty}
			<div class="giu-editable-list__empty">{@render empty()}</div>
		{/if}
	{:else if children}
		<ol class="giu-editable-list__rows">{@render children()}</ol>
	{:else if empty}
		<div class="giu-editable-list__empty">{@render empty()}</div>
	{/if}

	{#if addAction}
		<div class="giu-editable-list__add-action">{@render addAction()}</div>
	{/if}
</fieldset>

<style>
	.giu-editable-list {
		box-sizing: border-box;
		min-width: 0;
		margin: 0;
		padding: var(--giu-editable-list-padding, 0);
		border: var(--giu-editable-list-border, 0);
		color: var(--giu-editable-list-color, #202020);
	}

	.giu-editable-list__legend {
		padding: 0;
		font: inherit;
		font-weight: var(--giu-editable-list-legend-weight, 600);
		line-height: var(--giu-editable-list-legend-line-height, 1.4);
	}

	.giu-editable-list__description,
	.giu-editable-list__empty {
		margin-top: var(--giu-editable-list-description-gap, 0.375rem);
		color: var(--giu-editable-list-description-color, #505050);
		line-height: var(--giu-editable-list-description-line-height, 1.4);
	}

	.giu-editable-list__empty {
		margin-top: var(--giu-editable-list-empty-gap, 0.75rem);
		color: var(--giu-editable-list-empty-color, #505050);
		line-height: var(--giu-editable-list-empty-line-height, 1.4);
	}

	.giu-editable-list__rows {
		display: grid;
		gap: var(--giu-editable-list-row-gap, 0.75rem);
		padding: 0;
		margin: var(--giu-editable-list-rows-gap, 0.75rem) 0 0;
		list-style: none;
	}

	.giu-editable-list__add-action {
		margin-top: var(--giu-editable-list-add-action-gap, 0.75rem);
	}
</style>
