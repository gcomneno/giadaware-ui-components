import type { Snippet } from 'svelte';
import type { HTMLSelectAttributes } from 'svelte/elements';

export type SelectSingleValue = string | null | undefined;
export type SelectMultipleValue = string[];

type SelectNativeAttributes = Omit<
	HTMLSelectAttributes,
	'children' | 'class' | 'style' | 'multiple' | 'value' | 'defaultValue' | 'defaultvalue'
>;

export type SelectSingleProps = SelectNativeAttributes & {
	multiple?: false | undefined;
	value?: SelectSingleValue;
	children: Snippet;
	class?: HTMLSelectAttributes['class'];
	style?: HTMLSelectAttributes['style'];
};

export type SelectMultipleProps = SelectNativeAttributes & {
	multiple: true;
	value?: SelectMultipleValue;
	children: Snippet;
	class?: HTMLSelectAttributes['class'];
	style?: HTMLSelectAttributes['style'];
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;
