<script lang="ts">
	import type { NavListItem, NavListProps as Props } from './nav-list.js';

	let {
		items,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	function getAriaCurrent(current: NavListItem['current']) {
		if (current === true) {
			return 'page';
		}

		if (typeof current === 'string') {
			return current;
		}

		return undefined;
	}
</script>

<nav
	{...nativeAttributes}
	class={['giu-nav-list', className]}
	{style}
>
	<ul class="giu-nav-list__list">
		{#each items as item}
			{@const { label, current, class: itemClass, style: itemStyle, ...anchorAttributes } = item}

			<li class="giu-nav-list__item">
				<a
					{...anchorAttributes}
					aria-current={getAriaCurrent(current)}
					class={['giu-nav-list__link', itemClass]}
					style={itemStyle}
				>
					{label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.giu-nav-list {
		box-sizing: border-box;
		min-width: 0;
		color: var(--giu-nav-list-color, #202020);
	}

	.giu-nav-list__list {
		display: flex;
		flex-direction: column;
		gap: var(--giu-nav-list-gap, 0.25rem);
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.giu-nav-list__item {
		box-sizing: border-box;
		min-width: 0;
	}

	.giu-nav-list__link {
		display: block;
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-nav-list-link-padding, 0.5rem 0.75rem);
		border-radius: var(--giu-nav-list-link-border-radius, 0.375rem);
		color: var(--giu-nav-list-link-color, currentColor);
		text-decoration: var(--giu-nav-list-link-text-decoration, none);
		overflow-wrap: anywhere;
	}

	.giu-nav-list__link:hover {
		color: var(--giu-nav-list-link-hover-color, var(--giu-nav-list-link-color, currentColor));
		background: var(--giu-nav-list-link-hover-background, #eeeeee);
		text-decoration: var(--giu-nav-list-link-hover-text-decoration, underline);
	}

	.giu-nav-list__link:focus-visible {
		outline: var(--giu-nav-list-focus-width, 3px) solid
			var(--giu-nav-list-focus-color, #1559a6);
		outline-offset: var(--giu-nav-list-focus-offset, 2px);
	}

	.giu-nav-list__link[aria-current] {
		color: var(--giu-nav-list-current-color, var(--giu-nav-list-link-color, currentColor));
		background: var(--giu-nav-list-current-background, #e8f1fb);
		font-weight: var(--giu-nav-list-current-font-weight, 600);
		text-decoration: var(--giu-nav-list-current-text-decoration, none);
	}

	@media (forced-colors: active) {
		.giu-nav-list {
			color: CanvasText;
		}

		.giu-nav-list__link {
			color: LinkText;
		}

		.giu-nav-list__link:hover,
		.giu-nav-list__link[aria-current] {
			color: HighlightText;
			background: Highlight;
		}

		.giu-nav-list__link:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
