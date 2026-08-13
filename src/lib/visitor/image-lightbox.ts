import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';

export type ImageLightboxLabels = {
	dialog: string;
	close: string;
};

export type ImageLightboxProps = {
	open: boolean;
	onopenchange: (open: boolean) => void;
	src: string;
	alt: string;
	labels: ImageLightboxLabels;
	caption?: Snippet;
	actions?: Snippet;
	class?: HTMLDialogAttributes['class'];
	style?: HTMLDialogAttributes['style'];
};

type ScrollLockState = {
	count: number;
	htmlOverflow: string;
	bodyOverflow: string;
};

const scrollLocks = new WeakMap<Document, ScrollLockState>();

export function acquireImageLightboxScrollLock(
	document: Document
): () => void {
	const existing = scrollLocks.get(document);

	if (existing) {
		existing.count += 1;
	} else {
		const state: ScrollLockState = {
			count: 1,
			htmlOverflow: document.documentElement.style.overflow,
			bodyOverflow: document.body.style.overflow
		};

		scrollLocks.set(document, state);
		document.documentElement.style.overflow = 'hidden';
		document.body.style.overflow = 'hidden';
	}

	let released = false;

	return () => {
		if (released) return;
		released = true;

		const state = scrollLocks.get(document);
		if (!state) return;

		state.count -= 1;

		if (state.count > 0) return;

		document.documentElement.style.overflow = state.htmlOverflow;
		document.body.style.overflow = state.bodyOverflow;
		scrollLocks.delete(document);
	};
}
