import type { HTMLInputAttributes } from 'svelte/elements';

type ComboboxNativeAttributes = Omit<
	HTMLInputAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'type'
	| 'value'
	| 'defaultValue'
	| 'defaultvalue'
	| 'role'
	| 'aria-autocomplete'
	| 'aria-controls'
	| 'aria-expanded'
	| 'aria-activedescendant'
	| 'disabled'
	| 'oninput'
	| 'onkeydown'
	| 'onclick'
>;

export type ComboboxValue = string | null;

export type ComboboxOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

export type ComboboxProps = ComboboxNativeAttributes & {
	query: string;
	value?: ComboboxValue;
	options: readonly ComboboxOption[];
	onquerychange: (query: string) => void;
	onvaluechange: (value: string) => void;
	id?: string;
	disabled?: boolean;
	class?: HTMLInputAttributes['class'];
	style?: HTMLInputAttributes['style'];
	listboxClass?: string;
	listboxStyle?: string;
	onclick?: HTMLInputAttributes['onclick'];
};
