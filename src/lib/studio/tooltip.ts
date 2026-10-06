import type { Snippet } from 'svelte';

export type TooltipTriggerProps = {
	'aria-describedby': string;
	onfocus: (event: FocusEvent) => void;
	onblur: (event: FocusEvent) => void;
	onpointerenter: (event: PointerEvent) => void;
	onpointerleave: (event: PointerEvent) => void;
	onkeydown: (event: KeyboardEvent) => void;
};

export type TooltipProps = {
	trigger: Snippet<[TooltipTriggerProps]>;
	children: Snippet;
	id?: string;
	class?: string;
	style?: string;
};
