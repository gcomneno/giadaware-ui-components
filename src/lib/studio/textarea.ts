import type { HTMLTextareaAttributes } from 'svelte/elements';

export type TextareaValue = string;
export type TextareaResize = 'block' | 'inline' | 'both' | 'none';

export type TextareaProps = Omit<
	HTMLTextareaAttributes,
	'children' | 'class' | 'style' | 'value'
> & {
	value?: TextareaValue;
	resize?: TextareaResize;
	class?: HTMLTextareaAttributes['class'];
	style?: HTMLTextareaAttributes['style'];
};
