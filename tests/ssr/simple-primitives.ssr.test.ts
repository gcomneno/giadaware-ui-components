import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import SimplePrimitivesProbe from '../fixtures/SimplePrimitivesProbe.svelte';

test('renders deterministic native semantics for the simple primitives', () => {
	const first = render(SimplePrimitivesProbe);
	const second = render(SimplePrimitivesProbe);

	expect(first).toEqual(second);

	expect(first.body).toContain(
		'<input'
	);
	expect(first.body).toContain(
		'id="simple-text"'
	);
	expect(first.body).toContain(
		'class="giu-text-input'
	);

	expect(first.body).toContain(
		'<textarea'
	);
	expect(first.body).toContain(
		'giu-textarea--resize-both'
	);

	expect(
		first.body.match(/<select/g)
	).toHaveLength(2);
	expect(first.body).toMatch(
		/<select[^>]*id="simple-multiple"[^>]*multiple/
	);

	expect(first.body).toContain(
		'<details'
	);
	expect(first.body).toContain(
		'<summary'
	);
	expect(first.body).not.toMatch(
		/<details[^>]* open/
	);

	expect(first.body).toContain(
		'<nav aria-label="Project sections"'
	);
	expect(first.body).toContain(
		'aria-current="page"'
	);
	expect(first.body).toContain(
		'aria-current="step"'
	);

	expect(first.body).toContain(
		'<table'
	);
	expect(first.body).toContain(
		'<caption'
	);
	expect(first.body).toContain(
		'<thead'
	);
	expect(first.body).toContain(
		'<tbody'
	);
	expect(
		first.body.match(/<th(?=[\s>])/g)
	).toHaveLength(2);
	expect(
		first.body.match(/<td/g)
	).toHaveLength(4);
});

test('preserves consumer native attributes on simple controls', () => {
	const { body } = render(SimplePrimitivesProbe);

	expect(body).toContain(
		'name="text"'
	);
	expect(body).toContain(
		'placeholder="Type here"'
	);
	expect(body).toContain(
		'name="notes"'
	);
	expect(body).toContain(
		'name="single"'
	);
	expect(body).toContain(
		'name="multiple"'
	);
	expect(body).toContain(
		'scope="col"'
	);
});
