<script lang="ts">
	import FormStatusPresentation from './internal/FormStatusPresentation.svelte';

	import type { FormStatusTone } from './form-status.js';

	type Props = {
		message: string;
		tone?: FormStatusTone;
		durationMs?: number | null;
		class?: string;
		style?: string;
	};

	let {
		message,
		tone = 'info',
		durationMs = null,
		class: className,
		style
	}: Props = $props();
</script>

<FormStatusPresentation
	{message}
	{tone}
	{durationMs}
	class={className}
	{style}
/>
