import type { Snippet } from 'svelte';
import type { HTMLDetailsAttributes } from 'svelte/elements';

type DisclosureNativeAttributes = Omit<
	HTMLDetailsAttributes,
	'children' | 'class' | 'style' | 'open' | 'bind:open'
>;

export type DisclosureProps = DisclosureNativeAttributes & {
	summary: Snippet;
	children: Snippet;
	open?: boolean;
	class?: HTMLDetailsAttributes['class'];
	style?: HTMLDetailsAttributes['style'];
};
