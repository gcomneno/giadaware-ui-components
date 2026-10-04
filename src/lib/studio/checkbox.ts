import type { HTMLInputAttributes } from 'svelte/elements';

export type CheckboxProps = Omit<
	HTMLInputAttributes,
	'children' | 'class' | 'style' | 'type' | 'checked'
> & {
	checked?: HTMLInputAttributes['checked'];
	class?: HTMLInputAttributes['class'];
	style?: HTMLInputAttributes['style'];
};
