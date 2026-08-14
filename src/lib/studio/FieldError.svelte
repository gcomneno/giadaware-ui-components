<script lang="ts">
	import type { FieldErrorProps as Props } from './field-error.js';

	let {
		text,
		id,
		announce = false,
		class: className,
		style
	}: Props = $props();

	const hasText = $derived(
		typeof text === 'string' && Boolean(text.trim())
	);
	const resolvedId = $derived(
		hasText &&
			typeof id === 'string' &&
			id.trim()
			? id
			: undefined
	);
	const isLive = $derived(announce === true);
</script>

{#if hasText}
	<p
		id={resolvedId}
		class={['giu-field-error', className]}
		{style}
		role={isLive ? 'alert' : undefined}
		aria-live={isLive ? 'assertive' : undefined}
		aria-atomic={isLive ? 'true' : undefined}
	>
		{text}
	</p>
{/if}

<style>
	.giu-field-error {
		margin: 0;
		color: var(--giu-field-error-color, #9f1d1d);
		font-size: var(--giu-field-error-size, 0.875rem);
		line-height: var(--giu-field-error-line-height, 1.4);
	}
</style>
