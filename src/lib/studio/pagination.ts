import type { HTMLAttributes } from 'svelte/elements';

type NavAttributes = HTMLAttributes<HTMLElement>;

type PaginationNativeAttributes = Omit<
	NavAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'aria-label'
	| 'aria-labelledby'
>;

export type PaginationLabels = {
	navigation: string;
	previous: string;
	next: string;
	page: (page: number) => string;
};

export type PaginationProps = PaginationNativeAttributes & {
	page: number;
	pageCount: number;
	onpagechange: (page: number) => void;
	labels: PaginationLabels;
	class?: NavAttributes['class'];
	style?: NavAttributes['style'];
};
