<script lang="ts">
	import type { TableHeadProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<thead
	{...nativeAttributes}
	class={['giu-table-head', className]}
	{style}
>
	{@render children()}
</thead>

<style>
	.giu-table-head {
		box-sizing: border-box;
		color: var(--giu-table-head-color, currentColor);
		background: var(--giu-table-head-background, #f3f3f3);
	}

	@media (forced-colors: active) {
		.giu-table-head {
			color: CanvasText;
			background: Canvas;
		}
	}
</style>
