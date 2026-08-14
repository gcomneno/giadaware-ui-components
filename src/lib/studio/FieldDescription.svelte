<script lang="ts">
	import type { FieldDescriptionProps as Props } from './field-description.js';

	let {
		text,
		id,
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
</script>

{#if hasText}
	<p
		id={resolvedId}
		class={['giu-field-description', className]}
		{style}
	>
		{text}
	</p>
{/if}

<style>
	.giu-field-description {
		margin: 0;
		color: var(--giu-field-description-color, #505050);
		font-size: var(--giu-field-description-size, 0.875rem);
		line-height: var(--giu-field-description-line-height, 1.4);
	}
</style>
