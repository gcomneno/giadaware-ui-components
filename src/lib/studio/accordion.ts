import type { Snippet } from 'svelte';
import type {
	HTMLAttributes,
	HTMLDetailsAttributes
} from 'svelte/elements';

type DivAttributes = HTMLAttributes<HTMLDivElement>;

type AccordionNativeAttributes = Omit<
	DivAttributes,
	'children' | 'class' | 'style' | 'id'
>;

type AccordionItemNativeAttributes = Omit<
	HTMLDetailsAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'open'
	| 'bind:open'
	| 'name'
>;

export type AccordionProps = AccordionNativeAttributes & {
	children: Snippet;
	multiple?: boolean;
	id?: string;
	class?: DivAttributes['class'];
	style?: DivAttributes['style'];
};

export type AccordionItemProps = AccordionItemNativeAttributes & {
	summary: Snippet;
	children: Snippet;
	open?: boolean;
	class?: HTMLDetailsAttributes['class'];
	style?: HTMLDetailsAttributes['style'];
};
