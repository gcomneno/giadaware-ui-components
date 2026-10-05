import type { HTMLInputAttributes } from 'svelte/elements';

export type RadioValue = HTMLInputAttributes['value'];

export type RadioProps = Omit<
	HTMLInputAttributes,
	'children' | 'class' | 'style' | 'type' | 'checked' | 'value'
> & {
	value: RadioValue;
	group?: RadioValue;
	class?: HTMLInputAttributes['class'];
	style?: HTMLInputAttributes['style'];
};
