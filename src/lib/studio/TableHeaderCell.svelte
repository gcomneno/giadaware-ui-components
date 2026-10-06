<script lang="ts">
	import type { TableHeaderCellProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<th
	{...nativeAttributes}
	class={['giu-table-header-cell', className]}
	{style}
>
	{@render children()}
</th>

<style>
	.giu-table-header-cell {
		box-sizing: border-box;
		padding: var(--giu-table-cell-padding, 0.625rem 0.75rem);
		border: var(--giu-table-cell-border-width, 1px) solid
			var(--giu-table-cell-border-color, #d8d8d8);
		color: var(--giu-table-header-cell-color, currentColor);
		background: var(--giu-table-header-cell-background, transparent);
		font-weight: var(--giu-table-header-cell-font-weight, 600);
		text-align: var(--giu-table-header-cell-text-align, inherit);
		vertical-align: var(--giu-table-cell-vertical-align, top);
	}

	@media (forced-colors: active) {
		.giu-table-header-cell {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
		}
	}
</style>
