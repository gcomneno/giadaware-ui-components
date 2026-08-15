<script lang="ts">
	import FormStatusPresentation from '../internal/FormStatusPresentation.svelte';
	import { normalizeAsyncOperationHeadingLevel, normalizeAsyncOperationState } from './async-operation-panel.js';

	import type {
		AsyncOperationPanelProps as Props,
		AsyncOperationProgress,
		AsyncOperationState
	} from './async-operation-panel.js';

	function normalizeAsyncOperationProgress(state: AsyncOperationState, value: unknown): AsyncOperationProgress | undefined {
		if (state !== 'running' || value === null || typeof value !== 'object') {
			return undefined;
		}

		const progress = value as {
			mode?: unknown;
			label?: unknown;
			value?: unknown;
			max?: unknown;
		};

		if (typeof progress.label !== 'string') {
			return undefined;
		}

		const label = progress.label.trim();
		if (label.length === 0) {
			return undefined;
		}

		if (progress.mode === 'indeterminate') {
			return { mode: 'indeterminate', label };
		}

		if (progress.mode !== 'determinate') {
			return undefined;
		}

		if (!Number.isFinite(progress.value) || !Number.isFinite(progress.max) || (progress.max as number) <= 0) {
			return { mode: 'indeterminate', label };
		}

		const max = progress.max as number;
		const normalizedValue = Math.min(Math.max(progress.value as number, 0), max);

		return { mode: 'determinate', label, value: normalizedValue, max };
	}

	let {
		state,
		title,
		action,
		description,
		message,
		progress,
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
	const normalizedProgress = $derived(normalizeAsyncOperationProgress(normalizedState, progress));
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

	{#if normalizedProgress}
		<div class="async-operation-panel__progress" data-giu-progress={normalizedProgress.mode}>
			{#if normalizedProgress.mode === 'determinate'}
				<progress
					class="async-operation-panel__progress-bar"
					aria-label={normalizedProgress.label}
					value={normalizedProgress.value}
					max={normalizedProgress.max}
				></progress>
			{:else}
				<progress
					class="async-operation-panel__progress-bar"
					aria-label={normalizedProgress.label}
				></progress>
			{/if}
		</div>
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
	.async-operation-panel__progress,
	.async-operation-panel__result,
	.async-operation-panel__details-content { min-width: 0; }

	.async-operation-panel :is(h2, h3, h4, h5, h6) { margin: 0; font-size: var(--giu-async-operation-panel-title-size, 1.125rem); }

	.async-operation-panel__progress-bar {
		display: block;
		width: 100%;
		height: var(--giu-async-operation-panel-progress-height, 0.5rem);
		border: var(--giu-async-operation-panel-progress-border-width, 0) solid var(--giu-async-operation-panel-progress-border-color, transparent);
		border-radius: var(--giu-async-operation-panel-progress-radius, 999px);
		overflow: hidden;
		color: var(--giu-async-operation-panel-progress-color, #1559a6);
		background: var(--giu-async-operation-panel-progress-background, #e6e6e6);
		accent-color: var(--giu-async-operation-panel-progress-color, #1559a6);
	}

	.async-operation-panel__progress-bar::-webkit-progress-bar {
		border-radius: var(--giu-async-operation-panel-progress-radius, 999px);
		background: var(--giu-async-operation-panel-progress-background, #e6e6e6);
	}

	.async-operation-panel__progress-bar::-webkit-progress-value {
		border-radius: var(--giu-async-operation-panel-progress-radius, 999px);
		background: var(--giu-async-operation-panel-progress-color, #1559a6);
	}

	.async-operation-panel__progress-bar::-moz-progress-bar {
		border-radius: var(--giu-async-operation-panel-progress-radius, 999px);
		background: var(--giu-async-operation-panel-progress-color, #1559a6);
	}

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
