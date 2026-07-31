<script lang="ts">
	import {
		normalizeFormActionsAlign,
		type FormActionsProps as Props
	} from './form-actions.js';

	let {
		children,
		align = 'start',
		wrap = true,
		class: className,
		style
	}: Props = $props();

	const normalizedAlign = $derived(normalizeFormActionsAlign(align));
</script>

<div
	class={[
		'giu-form-actions',
		`giu-form-actions--align-${normalizedAlign}`,
		wrap ? 'giu-form-actions--wrap' : 'giu-form-actions--nowrap',
		className
	]}
	{style}
>
	{@render children()}
</div>

<style>
	.giu-form-actions {
		box-sizing: border-box;
		display: flex;
		min-width: 0;
		flex-direction: row;
		align-items: center;
		gap: var(--giu-form-actions-gap, 0.75rem);
	}

	.giu-form-actions--align-start {
		justify-content: flex-start;
	}

	.giu-form-actions--align-center {
		justify-content: center;
	}

	.giu-form-actions--align-end {
		justify-content: flex-end;
	}

	.giu-form-actions--align-space-between {
		justify-content: space-between;
	}

	.giu-form-actions--wrap {
		flex-wrap: wrap;
	}

	.giu-form-actions--nowrap {
		flex-wrap: nowrap;
	}
</style>
