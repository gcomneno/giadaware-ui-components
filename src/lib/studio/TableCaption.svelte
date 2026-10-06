<script lang="ts">
	import type { TableCaptionProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<caption
	{...nativeAttributes}
	class={['giu-table-caption', className]}
	{style}
>
	{@render children()}
</caption>

<style>
	.giu-table-caption {
		box-sizing: border-box;
		padding: var(--giu-table-caption-padding, 0 0 0.5rem);
		caption-side: var(--giu-table-caption-side, top);
		color: var(--giu-table-caption-color, currentColor);
		font-weight: var(--giu-table-caption-font-weight, 600);
		text-align: var(--giu-table-caption-text-align, left);
	}
</style>
