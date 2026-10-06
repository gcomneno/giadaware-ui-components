<script lang="ts">
	import type { TableBodyProps as Props } from './table.js';

	let {
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<tbody
	{...nativeAttributes}
	class={['giu-table-body', className]}
	{style}
>
	{@render children()}
</tbody>

<style>
	.giu-table-body {
		box-sizing: border-box;
	}
</style>
