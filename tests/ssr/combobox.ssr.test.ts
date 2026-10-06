import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import ComboboxProbe from '../fixtures/ComboboxProbe.svelte';

test('renders deterministic closed combobox semantics', () => {
	const first = render(ComboboxProbe);
	const second = render(ComboboxProbe);

	expect(first).toEqual(second);

	expect(first.body).toContain(
		'id="cities-input"'
	);
	expect(first.body).toContain(
		'role="combobox"'
	);
	expect(first.body).toContain(
		'aria-autocomplete="list"'
	);
	expect(first.body).toContain(
		'aria-controls="cities-listbox"'
	);
	expect(first.body).toContain(
		'aria-expanded="false"'
	);
	expect(first.body).not.toContain(
		'aria-activedescendant='
	);

	expect(first.body).toContain(
		'id="cities-listbox"'
	);
	expect(first.body).toContain(
		'role="listbox"'
	);
	expect(first.body).toContain(
		'hidden'
	);

	expect(
		first.body.match(/role="option"/g)
	).toHaveLength(4);

	expect(first.body).toMatch(
		/id="cities-option-2"[^>]*role="option"[^>]*aria-selected="true"/
	);

	expect(first.body).toMatch(
		/id="cities-option-1"[^>]*aria-disabled="true"/
	);
});

test('disabled combobox renders native disabled input', () => {
	const { body } = render(ComboboxProbe, {
		props: {
			disabled: true
		}
	});

	expect(body).toMatch(
		/<input[^>]*role="combobox"[^>]*disabled/
	);
});
