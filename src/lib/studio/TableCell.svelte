<script lang="ts">
	import type { TableCellProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<td
	{...nativeAttributes}
	class={['giu-table-cell', className]}
	{style}
>
	{@render children()}
</td>

<style>
	.giu-table-cell {
		box-sizing: border-box;
		padding: var(--giu-table-cell-padding, 0.625rem 0.75rem);
		border: var(--giu-table-cell-border-width, 1px) solid
			var(--giu-table-cell-border-color, #d8d8d8);
		color: var(--giu-table-cell-color, currentColor);
		background: var(--giu-table-cell-background, transparent);
		text-align: var(--giu-table-cell-text-align, inherit);
		vertical-align: var(--giu-table-cell-vertical-align, top);
	}

	@media (forced-colors: active) {
		.giu-table-cell {
			border-color: CanvasText;
		}
	}
</style>
