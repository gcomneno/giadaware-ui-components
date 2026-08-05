import type { Snippet } from 'svelte';

export type EditableListRowProps = {
	position: number;
	fields: Snippet;
	actions?: Snippet;
	class?: string;
	style?: string;
};
