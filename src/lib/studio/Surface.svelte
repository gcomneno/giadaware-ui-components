<script lang="ts">
	import type { SurfaceProps as Props } from './surface.js';

	let {
		children,
		class: className,
		style
	}: Props = $props();
</script>

<div class={['giu-surface', className]} {style}>
	{@render children()}
</div>

<style>
	.giu-surface {
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-surface-padding, 1rem);
		border: var(--giu-surface-border-width, 1px) solid
			var(--giu-surface-border-color, #767676);
		border-radius: var(--giu-surface-border-radius, 0.5rem);
		color: var(--giu-surface-color, #202020);
		background: var(--giu-surface-background, #ffffff);
	}
</style>
