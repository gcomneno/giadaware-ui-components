<script lang="ts">
	import type { TableProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<table
	{...nativeAttributes}
	class={['giu-table', className]}
	{style}
>
	{@render children()}
</table>

<style>
	.giu-table {
		box-sizing: border-box;
		width: var(--giu-table-width, 100%);
		max-width: var(--giu-table-max-width, 100%);
		min-width: var(--giu-table-min-width, 0);
		border: var(--giu-table-border-width, 0) solid var(--giu-table-border-color, #c8c8c8);
		border-collapse: var(--giu-table-border-collapse, collapse);
		border-spacing: var(--giu-table-border-spacing, 0);
		color: var(--giu-table-color, #202020);
		background: var(--giu-table-background, #ffffff);
		font: inherit;
		line-height: var(--giu-table-line-height, 1.4);
		text-align: var(--giu-table-text-align, left);
	}

	@media (forced-colors: active) {
		.giu-table {
			border-color: CanvasText;
		}
	}
</style>
