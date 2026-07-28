<script lang="ts">
	import type { PageIntroProps as Props } from './page-intro.js';

	let {
		children,
		class: className,
		style
	}: Props = $props();
</script>

<p class={['giu-page-intro', className]} {style}>
	{@render children()}
</p>

<style>
	.giu-page-intro {
		margin: var(--giu-page-intro-margin, 0 0 1rem);
		color: var(--giu-page-intro-color, #303030);
		line-height: var(--giu-page-intro-line-height, 1.5);
	}

	.giu-page-intro :global(a) {
		color: var(--giu-page-intro-link-color, currentColor);
	}
</style>
