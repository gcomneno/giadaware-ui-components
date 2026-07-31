import type { Snippet } from 'svelte';

export type FormActionsAlign =
	| 'start'
	| 'center'
	| 'end'
	| 'space-between';

export type FormActionsProps = {
	children: Snippet;
	align?: FormActionsAlign;
	wrap?: boolean;
	class?: string;
	style?: string;
};

export function normalizeFormActionsAlign(
	value: unknown
): FormActionsAlign {
	switch (value) {
		case 'start':
		case 'center':
		case 'end':
		case 'space-between':
			return value;
		default:
			return 'start';
	}
}
