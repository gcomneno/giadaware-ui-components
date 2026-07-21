<script lang="ts">
	import FormStatusPresentation from '../internal/FormStatusPresentation.svelte';
	import { normalizeAsyncOperationHeadingLevel, normalizeAsyncOperationState } from './async-operation-panel.js';

	import type { AsyncOperationPanelProps as Props } from './async-operation-panel.js';

	let {
		state,
		title,
		action,
		description,
		message,
		result,
		technicalDetails,
		technicalDetailsLabel,
		technicalDetailsInitiallyExpanded = false,
		busyLabel,
		headingLevel = 2,
		id,
		class: className,
		style
	}: Props = $props();

	const generatedId = $props.id();
	const panelId = $derived(id ?? generatedId);
	const titleId = $derived(`${panelId}-title`);
	const normalizedState = $derived(normalizeAsyncOperationState(state));
	const normalizedHeadingLevel = $derived(normalizeAsyncOperationHeadingLevel(headingLevel));
	const headingTag = $derived(`h${normalizedHeadingLevel}` as const);
	const running = $derived(normalizedState === 'running');
	const terminal = $derived(normalizedState === 'success' || normalizedState === 'warning' || normalizedState === 'error');
	const statusTone = $derived(
		normalizedState === 'success' || normalizedState === 'warning' || normalizedState === 'error'
			? normalizedState
			: 'info'
	);
	const statusMessage = $derived(running ? busyLabel : normalizedState === 'idle' ? undefined : message);
</script>

<section
	id={panelId}
	class={['async-operation-panel', `async-operation-panel--${normalizedState}`, className]}
	{style}
	aria-busy={running ? 'true' : undefined}
	aria-labelledby={titleId}
	data-state={normalizedState}
>
	<header class="async-operation-panel__header">
		<svelte:element this={headingTag} id={titleId}>{title}</svelte:element>
		{#if description}
			<div class="async-operation-panel__description">{@render description()}</div>
		{/if}
	</header>

	<div class="async-operation-panel__action">
		{@render action()}
	</div>

	{#if statusMessage}
		<FormStatusPresentation message={statusMessage} tone={statusTone} />
	{/if}

	{#if terminal && result}
		<div class="async-operation-panel__result">{@render result()}</div>
	{/if}

	{#if technicalDetails !== undefined && technicalDetailsLabel !== undefined}
		<details class="async-operation-panel__details" open={technicalDetailsInitiallyExpanded}>
			<summary>{technicalDetailsLabel}</summary>
			<pre class="async-operation-panel__details-content">{technicalDetails}</pre>
		</details>
	{/if}
</section>

<style>
	.async-operation-panel {
		display: flex;
		flex-direction: column;
		gap: var(--giu-async-operation-panel-gap, 0.875rem);
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-async-operation-panel-padding, 1rem);
		border: var(--giu-async-operation-panel-border-width, 1px) solid var(--giu-async-operation-panel-border-color, #767676);
		border-radius: var(--giu-async-operation-panel-border-radius, 0.5rem);
		color: var(--giu-async-operation-panel-color, #202020);
		background: var(--giu-async-operation-panel-background, #ffffff);
	}

	.async-operation-panel__header,
	.async-operation-panel__description,
	.async-operation-panel__result,
	.async-operation-panel__details-content { min-width: 0; }

	.async-operation-panel :is(h2, h3, h4, h5, h6) { margin: 0; font-size: var(--giu-async-operation-panel-title-size, 1.125rem); }
	.async-operation-panel summary:focus-visible {
		outline: var(--giu-async-operation-panel-focus-width, 3px) solid var(--giu-async-operation-panel-focus-color, #1559a6);
		outline-offset: var(--giu-async-operation-panel-focus-offset, 2px);
	}

	.async-operation-panel summary { cursor: pointer; }
	.async-operation-panel__details-content {
		margin-top: var(--giu-async-operation-panel-details-gap, 0.5rem);
		margin-bottom: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		font: inherit;
		font-family: var(--giu-async-operation-panel-details-font-family, monospace);
	}
</style>
