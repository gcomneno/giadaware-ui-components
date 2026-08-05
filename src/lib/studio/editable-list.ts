import type { Snippet } from 'svelte';

export type EditableListProps = {
	legend: string;
	description?: Snippet;
	empty?: Snippet;
	children?: Snippet;
	/** Consumer-owned cardinality signal. True selects `empty`; false selects rows. */
	isEmpty?: boolean;
	addAction?: Snippet;
	class?: string;
	style?: string;
};
