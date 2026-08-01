import type { Snippet } from 'svelte';

export type PanelHeadingLevel = 2 | 3 | 4 | 5 | 6;

export type PanelProps = {
	title: string;
	description?: Snippet;
	actions?: Snippet;
	children: Snippet;
	headingLevel?: PanelHeadingLevel;
	id?: string;
	class?: string;
	style?: string;
};

export function normalizePanelHeadingLevel(value: unknown): PanelHeadingLevel {
	return value === 2 || value === 3 || value === 4 || value === 5 || value === 6
		? value
		: 2;
}
