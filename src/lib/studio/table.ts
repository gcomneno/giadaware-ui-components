import type { Snippet } from 'svelte';
import type {
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes,
	SvelteHTMLElements
} from 'svelte/elements';

type TableNativeAttributes = Omit<HTMLTableAttributes, 'children' | 'class' | 'style'>;
type TableCaptionNativeAttributes = Omit<
	SvelteHTMLElements['caption'],
	'children' | 'class' | 'style'
>;
type TableHeadNativeAttributes = Omit<
	SvelteHTMLElements['thead'],
	'children' | 'class' | 'style'
>;
type TableBodyNativeAttributes = Omit<
	SvelteHTMLElements['tbody'],
	'children' | 'class' | 'style'
>;
type TableRowNativeAttributes = Omit<
	SvelteHTMLElements['tr'],
	'children' | 'class' | 'style'
>;
type TableHeaderCellNativeAttributes = Omit<HTMLThAttributes, 'children' | 'class' | 'style'>;
type TableCellNativeAttributes = Omit<HTMLTdAttributes, 'children' | 'class' | 'style'>;

export type TableProps = TableNativeAttributes & {
	children: Snippet;
	class?: HTMLTableAttributes['class'];
	style?: HTMLTableAttributes['style'];
};

export type TableCaptionProps = TableCaptionNativeAttributes & {
	children: Snippet;
	class?: SvelteHTMLElements['caption']['class'];
	style?: SvelteHTMLElements['caption']['style'];
};

export type TableHeadProps = TableHeadNativeAttributes & {
	children: Snippet;
	class?: SvelteHTMLElements['thead']['class'];
	style?: SvelteHTMLElements['thead']['style'];
};

export type TableBodyProps = TableBodyNativeAttributes & {
	children: Snippet;
	class?: SvelteHTMLElements['tbody']['class'];
	style?: SvelteHTMLElements['tbody']['style'];
};

export type TableRowProps = TableRowNativeAttributes & {
	children: Snippet;
	class?: SvelteHTMLElements['tr']['class'];
	style?: SvelteHTMLElements['tr']['style'];
};

export type TableHeaderCellProps = TableHeaderCellNativeAttributes & {
	children: Snippet;
	class?: HTMLThAttributes['class'];
	style?: HTMLThAttributes['style'];
};

export type TableCellProps = TableCellNativeAttributes & {
	children: Snippet;
	class?: HTMLTdAttributes['class'];
	style?: HTMLTdAttributes['style'];
};
