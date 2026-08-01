<script lang="ts">
	import type { FieldLabelProps as Props } from './field-label.js';

	let {
		label,
		hint,
		required = false,
		optional = false,
		requiredLabel,
		optionalLabel,
		hintId,
		class: className,
		style
	}: Props = $props();

	const state = $derived(
		required ? 'required' : optional ? 'optional' : 'plain'
	);
	const hasRequiredMarker = $derived(
		state === 'required' && Boolean(requiredLabel?.trim())
	);
	const hasOptionalMarker = $derived(
		state === 'optional' && Boolean(optionalLabel?.trim())
	);
	const hasHint = $derived(Boolean(hint?.trim()));
	const resolvedHintId = $derived(
		hasHint && hintId?.trim() ? hintId : undefined
	);
</script>

<span
	class={[
		'giu-field-label-row',
		`giu-field-label-row--${state}`,
		className
	]}
	{style}
>
	<span class="giu-field-label">{label}</span>

	{#if hasRequiredMarker}
		<span
			class={[
				'giu-field-label-marker',
				'giu-field-label-marker--required'
			]}
		>
			<span
				class="giu-field-label-marker__symbol"
				aria-hidden="true"
			>
				*
			</span>
			<span class="giu-field-label-marker__accessible">
				{requiredLabel}
			</span>
		</span>
	{:else if hasOptionalMarker}
		<span
			class={[
				'giu-field-label-marker',
				'giu-field-label-marker--optional'
			]}
		>
			{optionalLabel}
		</span>
	{/if}
</span>

{#if hasHint}
	<span
		id={resolvedHintId}
		class="giu-field-label-hint"
	>
		{hint}
	</span>
{/if}

<style>
	.giu-field-label-row {
		display: inline-flex;
		min-width: 0;
		align-items: baseline;
		gap: var(--giu-field-label-row-gap, 0.375rem);
		color: var(--giu-field-label-color, #202020);
		font-weight: var(--giu-field-label-weight, 600);
		line-height: var(--giu-field-label-line-height, 1.4);
	}

	.giu-field-label {
		min-width: 0;
	}

	.giu-field-label-marker {
		flex: 0 0 auto;
		font-size: var(--giu-field-label-marker-size, 0.875em);
		font-weight: var(--giu-field-label-marker-weight, 600);
	}

	.giu-field-label-marker--required {
		color: var(--giu-field-label-required-color, #9f1d1d);
	}

	.giu-field-label-marker--optional {
		color: var(--giu-field-label-optional-color, #505050);
	}

	.giu-field-label-marker__accessible {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.giu-field-label-hint {
		display: block;
		margin-top: var(--giu-field-label-hint-gap, 0.25rem);
		color: var(--giu-field-label-hint-color, #505050);
		font-size: var(--giu-field-label-hint-size, 0.875rem);
		line-height: var(--giu-field-label-hint-line-height, 1.4);
	}
</style>
