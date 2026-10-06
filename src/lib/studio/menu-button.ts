import type { Snippet } from 'svelte';
import type {
	HTMLAttributes,
	HTMLButtonAttributes
} from 'svelte/elements';

type DivAttributes = HTMLAttributes<HTMLDivElement>;

type MenuButtonNativeAttributes = Omit<
	DivAttributes,
	'children' | 'class' | 'style'
>;

type MenuItemNativeAttributes = Omit<
	HTMLButtonAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'type'
	| 'role'
	| 'disabled'
	| 'tabindex'
	| 'onclick'
	| 'onkeydown'
>;

type MenuSeparatorNativeAttributes = Omit<
	DivAttributes,
	'children' | 'class' | 'style' | 'role'
>;

export type MenuButtonProps = MenuButtonNativeAttributes & {
	trigger: Snippet;
	children: Snippet;
	id?: string;
	disabled?: boolean;
	class?: DivAttributes['class'];
	style?: DivAttributes['style'];
	triggerClass?: HTMLButtonAttributes['class'];
	triggerStyle?: HTMLButtonAttributes['style'];
	menuClass?: DivAttributes['class'];
	menuStyle?: DivAttributes['style'];
};

export type MenuItemProps = MenuItemNativeAttributes & {
	children: Snippet;
	disabled?: boolean;
	class?: HTMLButtonAttributes['class'];
	style?: HTMLButtonAttributes['style'];
	onclick?: HTMLButtonAttributes['onclick'];
	onkeydown?: HTMLButtonAttributes['onkeydown'];
};

export type MenuSeparatorProps = MenuSeparatorNativeAttributes & {
	class?: DivAttributes['class'];
	style?: DivAttributes['style'];
};
