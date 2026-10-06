import type { Snippet } from 'svelte';
import type {
	HTMLAttributes,
	HTMLButtonAttributes
} from 'svelte/elements';

export type TabsValue = string;
export type TabsActivation = 'automatic' | 'manual';
export type TabsOrientation = 'horizontal' | 'vertical';

type DivAttributes = HTMLAttributes<HTMLDivElement>;

type TabsNativeAttributes = Omit<
	DivAttributes,
	'children' | 'class' | 'style' | 'id'
>;

type TabListNativeAttributes = Omit<
	DivAttributes,
	'children' | 'class' | 'style' | 'role' | 'aria-orientation' | 'onkeydown'
>;

type TabNativeAttributes = Omit<
	HTMLButtonAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'id'
	| 'type'
	| 'role'
	| 'disabled'
	| 'value'
	| 'aria-selected'
	| 'aria-controls'
	| 'aria-disabled'
	| 'tabindex'
	| 'onclick'
	| 'onfocus'
>;

type TabPanelNativeAttributes = Omit<
	DivAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'id'
	| 'role'
	| 'hidden'
	| 'aria-labelledby'
	| 'tabindex'
>;

export type TabsProps = TabsNativeAttributes & {
	value: TabsValue;
	onvaluechange: (value: TabsValue) => void;
	activation?: TabsActivation;
	id?: string;
	children: Snippet;
	class?: DivAttributes['class'];
	style?: DivAttributes['style'];
};

export type TabListProps = TabListNativeAttributes & {
	orientation?: TabsOrientation;
	children: Snippet;
	class?: DivAttributes['class'];
	style?: DivAttributes['style'];
	onkeydown?: DivAttributes['onkeydown'];
};

export type TabProps = TabNativeAttributes & {
	value: TabsValue;
	disabled?: boolean;
	children: Snippet;
	class?: HTMLButtonAttributes['class'];
	style?: HTMLButtonAttributes['style'];
	onclick?: HTMLButtonAttributes['onclick'];
	onfocus?: HTMLButtonAttributes['onfocus'];
};

export type TabPanelProps = TabPanelNativeAttributes & {
	value: TabsValue;
	children: Snippet;
	class?: DivAttributes['class'];
	style?: DivAttributes['style'];
};
