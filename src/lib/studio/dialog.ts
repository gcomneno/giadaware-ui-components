import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';

type DialogNativeAttributes = Omit<
	HTMLDialogAttributes,
	| 'children'
	| 'class'
	| 'style'
	| 'open'
	| 'bind:open'
	| 'on:cancel'
	| 'oncancel'
	| 'on:close'
	| 'onclose'
	| 'on:click'
	| 'onclick'
>;

export type DialogProps = DialogNativeAttributes & {
	open: boolean;
	onopenchange: (open: boolean) => void;
	children: Snippet;
	class?: HTMLDialogAttributes['class'];
	style?: HTMLDialogAttributes['style'];
	oncancel?: HTMLDialogAttributes['oncancel'];
	onclose?: HTMLDialogAttributes['onclose'];
	onclick?: HTMLDialogAttributes['onclick'];
};
