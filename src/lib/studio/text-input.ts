import type { HTMLInputAttributes } from 'svelte/elements';

export type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
export type TextInputValue = string;

export type TextInputProps = Omit<
	HTMLInputAttributes,
	'children' | 'class' | 'style' | 'type' | 'value' | 'defaultValue' | 'defaultvalue'
> & {
	type?: TextInputType;
	value?: TextInputValue;
	class?: HTMLInputAttributes['class'];
	style?: HTMLInputAttributes['style'];
};
