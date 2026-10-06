import type { HTMLAnchorAttributes, SvelteHTMLElements } from 'svelte/elements';

export type NavListCurrent =
	| boolean
	| 'page'
	| 'step'
	| 'location'
	| 'date'
	| 'time';

type NavListItemNativeAttributes = Omit<
	HTMLAnchorAttributes,
	'children' | 'class' | 'style' | 'href' | 'aria-current' | 'role'
>;

type NavListNativeAttributes = Omit<
	SvelteHTMLElements['nav'],
	'children' | 'class' | 'style' | 'role'
>;

export type NavListItem = NavListItemNativeAttributes & {
	href: string;
	label: string;
	current?: NavListCurrent;
	class?: HTMLAnchorAttributes['class'];
	style?: HTMLAnchorAttributes['style'];
};

export type NavListProps = NavListNativeAttributes & {
	items: readonly NavListItem[];
	class?: SvelteHTMLElements['nav']['class'];
	style?: SvelteHTMLElements['nav']['style'];
};
