import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { expect, test, vi } from 'vitest';

import Dialog from '../../src/lib/studio/Dialog.svelte';
import {
	DIALOG_HYDRATION_SSR_BODY,
	DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY
} from '../fixtures/dialog-hydration-contract.js';
import DialogHydrationProbe from '../fixtures/DialogHydrationProbe.svelte';
import DialogInitiallyOpenHydrationProbe from '../fixtures/DialogInitiallyOpenHydrationProbe.svelte';

const children = createRawSnippet(() => ({
	render: () => '<p data-testid="dialog-child">Dialog child</p>'
}));

function openingDialogTag(body: string): string {
	const match = body.match(/<dialog\b[^>]*>/);

	if (!match) {
		throw new TypeError('Dialog SSR markup did not contain a native dialog.');
	}

	return match[0];
}

function nativeDialogCount(body: string): number {
	return body.match(/<dialog\b/g)?.length ?? 0;
}

test('renders deterministic native dialog markup without browser-owned state', () => {
	const onopenchange = vi.fn();
	const props = {
		open: true,
		onopenchange,
		children,
		'aria-label': 'Consumer named dialog'
	};

	const first = render(Dialog, { props });
	const second = render(Dialog, { props });
	const tag = openingDialogTag(first.body);

	expect(first).toEqual(second);
	expect(nativeDialogCount(first.body)).toBe(1);
	expect(tag).toContain('aria-label="Consumer named dialog"');
	expect(first.body).toContain('Dialog child');
	expect(tag).not.toMatch(/\sopen(?:=|\s|>)/);
	expect(tag).not.toMatch(/\srole=/);
	expect(tag).not.toMatch(/\saria-modal=/);
	expect(onopenchange).not.toHaveBeenCalled();
});

test('forwards consumer aria-labelledby without manufacturing dialog semantics', () => {
	const labelledChildren = createRawSnippet(() => ({
		render: () => '<h2 id="dialog-title">Labelled dialog</h2><p>Labelled body</p>'
	}));

	const body = render(Dialog, {
		props: {
			open: false,
			onopenchange: vi.fn(),
			children: labelledChildren,
			'aria-labelledby': 'dialog-title'
		}
	}).body;
	const tag = openingDialogTag(body);

	expect(nativeDialogCount(body)).toBe(1);
	expect(tag).toContain('aria-labelledby="dialog-title"');
	expect(body).toContain('id="dialog-title"');
	expect(tag).not.toMatch(/\sopen(?:=|\s|>)/);
	expect(tag).not.toMatch(/\srole=/);
	expect(tag).not.toMatch(/\saria-modal=/);
});

test('renders deterministic hydration probe bodies without native open state', () => {
	const closed = render(DialogHydrationProbe);
	const initiallyOpen = render(DialogInitiallyOpenHydrationProbe);

	expect(closed).toEqual(render(DialogHydrationProbe));
	expect(initiallyOpen).toEqual(render(DialogInitiallyOpenHydrationProbe));
	expect(nativeDialogCount(closed.body)).toBe(1);
	expect(nativeDialogCount(initiallyOpen.body)).toBe(1);
	expect(closed.body).toContain('data-open="false"');
	expect(initiallyOpen.body).toContain('data-open="true"');
	expect(initiallyOpen.body).toBe(
		closed.body.replace('data-open="false"', 'data-open="true"')
	);
	expect(openingDialogTag(closed.body)).not.toMatch(/\sopen(?:=|\s|>)/);
	expect(openingDialogTag(initiallyOpen.body)).not.toMatch(/\sopen(?:=|\s|>)/);
	expect(closed.body).toBe(DIALOG_HYDRATION_SSR_BODY);
	expect(initiallyOpen.body).toBe(DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY);
});
