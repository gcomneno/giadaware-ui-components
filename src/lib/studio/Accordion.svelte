<script lang="ts">
	import {
		provideAccordionContext
	} from './accordion-internal.js';

	import type { AccordionProps as Props } from './accordion.js';

	let {
		children,
		multiple = false,
		id,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	const generatedId = $props.id();
	const rootId = $derived(id ?? generatedId);
	const groupName = $derived(
		multiple ? undefined : `${rootId}-group`
	);

	provideAccordionContext({
		getGroupName: () => groupName
	});
</script>

<div
	{...nativeAttributes}
	id={rootId}
	class={['giu-accordion', className]}
	{style}
	data-giu-accordion-mode={multiple ? 'multiple' : 'single'}
>
	{@render children()}
</div>

<style>
	.giu-accordion {
		box-sizing: border-box;
		display: grid;
		min-width: 0;
		gap: var(--giu-accordion-gap, 0.5rem);
	}
</style>
