import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import MenuButtonProbe from '../fixtures/MenuButtonProbe.svelte';

function getTag(body: string, testId: string): string {
	const match = body.match(
		new RegExp(`<[^>]*data-testid="${testId}"[^>]*>`)
	);

	if (!match) {
		throw new TypeError(`Missing SSR element ${testId}.`);
	}

	return match[0];
}

test('renders deterministic menu-button semantics and relationships', () => {
	const first = render(MenuButtonProbe);
	const second = render(MenuButtonProbe);

	expect(first).toEqual(second);

	const trigger = first.body.match(
		/<button[^>]*aria-haspopup="menu"[^>]*>/
	)?.[0];

	const menu = first.body.match(
		/<div[^>]*role="menu"[^>]*>/
	)?.[0];

	if (!trigger || !menu) {
		throw new TypeError(
			'Missing SSR trigger or menu.'
		);
	}

	expect(trigger).toContain(
		'id="actions-menu-trigger"'
	);
	expect(trigger).toContain(
		'aria-haspopup="menu"'
	);
	expect(trigger).toContain(
		'aria-expanded="false"'
	);
	expect(trigger).toContain(
		'aria-controls="actions-menu-menu"'
	);

	expect(menu).toContain(
		'id="actions-menu-menu"'
	);
	expect(menu).toContain(
		'aria-labelledby="actions-menu-trigger"'
	);
	expect(menu).toContain('tabindex="-1"');
	expect(menu).toContain('hidden');

	const edit = getTag(
		first.body,
		'menu-item-edit'
	);
	const disabled = getTag(
		first.body,
		'menu-item-disabled'
	);
	const separator = getTag(
		first.body,
		'menu-separator'
	);

	expect(edit).toContain('role="menuitem"');
	expect(edit).toContain('tabindex="-1"');
	expect(disabled).toContain('disabled');
	expect(separator).toContain('role="separator"');
});

test('disabled trigger remains closed in SSR', () => {
	const { body } = render(MenuButtonProbe, {
		props: {
			disabled: true
		}
	});

	const trigger = body.match(
		/<button[^>]*aria-haspopup="menu"[^>]*>/
	)?.[0];

	if (!trigger) {
		throw new TypeError(
			'Missing disabled SSR trigger.'
		);
	}

	expect(trigger).toContain('disabled');
	expect(trigger).toContain(
		'aria-expanded="false"'
	);
});
