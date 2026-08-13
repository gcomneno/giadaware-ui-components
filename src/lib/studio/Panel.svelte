<script lang="ts">
	import {
		normalizePanelHeadingLevel,
		type PanelProps as Props
	} from './panel.js';

	let {
		title,
		description,
		actions,
		footer,
		children,
		headingLevel = 2,
		id,
		class: className,
		style
	}: Props = $props();

	const generatedId = $props.id();
	const panelId = $derived(id ?? generatedId);
	const titleId = $derived(`${panelId}-title`);
	const normalizedHeadingLevel = $derived(
		normalizePanelHeadingLevel(headingLevel)
	);
	const headingTag = $derived(`h${normalizedHeadingLevel}` as const);
</script>

<section
	id={panelId}
	class={['giu-panel', className]}
	{style}
	aria-labelledby={titleId}
>
	<header class="giu-panel__header">
		<div class="giu-panel__heading">
			<svelte:element
				this={headingTag}
				id={titleId}
				class="giu-panel__title"
			>
				{title}
			</svelte:element>

			{#if description}
				<div class="giu-panel__description">
					{@render description()}
				</div>
			{/if}
		</div>

		{#if actions}
			<div class="giu-panel__actions">
				{@render actions()}
			</div>
		{/if}
	</header>

	<div class="giu-panel__body">
		{@render children()}
	</div>

	{#if footer}
		<div class="giu-panel__footer">
			{@render footer()}
		</div>
	{/if}
</section>

<style>
	.giu-panel {
		box-sizing: border-box;
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: var(--giu-panel-gap, 1rem);
		padding: var(--giu-panel-padding, 1rem);
		border: var(--giu-panel-border-width, 1px) solid
			var(--giu-panel-border-color, #767676);
		border-radius: var(--giu-panel-border-radius, 0.5rem);
		color: var(--giu-panel-color, #202020);
		background: var(--giu-panel-background, #ffffff);
	}

	.giu-panel__header {
		display: flex;
		min-width: 0;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--giu-panel-header-gap, 0.75rem);
	}

	.giu-panel__heading,
	.giu-panel__actions,
	.giu-panel__body,
	.giu-panel__footer,
	.giu-panel__description {
		min-width: 0;
	}

	.giu-panel__heading {
		flex: 1 1 16rem;
	}

	.giu-panel__actions {
		flex: 0 1 auto;
	}

	.giu-panel__title {
		margin: 0;
		font-size: var(--giu-panel-title-size, 1.125rem);
	}

	.giu-panel__description {
		margin-top: var(--giu-panel-description-gap, 0.25rem);
		color: var(--giu-panel-description-color, #404040);
	}
</style>
