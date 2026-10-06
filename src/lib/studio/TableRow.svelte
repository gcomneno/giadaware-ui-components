<script lang="ts">
	import type { TableRowProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<tr
	{...nativeAttributes}
	class={['giu-table-row', className]}
	{style}
>
	{@render children()}
</tr>

<style>
	.giu-table-row {
		box-sizing: border-box;
		border-block-end: var(--giu-table-row-border-width, 1px) solid
			var(--giu-table-row-border-color, #d8d8d8);
	}

	@media (forced-colors: active) {
		.giu-table-row {
			border-block-end-color: CanvasText;
		}
	}
</style>
