<script lang="ts">
	import type { MenuSeparatorProps as Props } from './menu-button.js';

	let {
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();
</script>

<div
	{...nativeAttributes}
	role="separator"
	class={['giu-menu-separator', className]}
	{style}
></div>

<style>
	.giu-menu-separator {
		box-sizing: border-box;
		height: var(--giu-menu-button-separator-width, 1px);
		margin: var(--giu-menu-button-separator-margin, 0.25rem 0);
		background: var(--giu-menu-button-separator-color, #d0d0d0);
	}

	@media (forced-colors: active) {
		.giu-menu-separator {
			background: CanvasText;
		}
	}
</style>
