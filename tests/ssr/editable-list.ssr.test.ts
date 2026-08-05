import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';
import { EditableList, EditableListRow, ReorderActions } from '../../src/lib/studio/index.js';

const description = createRawSnippet(() => ({ render: () => '<p>Ordered images.</p>' }));
const empty = createRawSnippet(() => ({ render: () => '<p>No images.</p>' }));
const addAction = createRawSnippet(() => ({ render: () => '<button type="button">Add image</button>' }));
const fields = createRawSnippet(() => ({ render: () => '<label>Title <input name="title"></label>' }));
const row = createRawSnippet(() => ({ render: () => '<li>Consumer row</li>' }));

describe('editable-list SSR', () => {
	test('renders the fieldset, legend, optional regions, and rows when isEmpty is false', () => {
		const one = render(EditableList, { props: { legend: 'Gallery', description, children: row, empty, isEmpty: false, addAction } });
		expect(one).toEqual(render(EditableList, { props: { legend: 'Gallery', description, children: row, empty, isEmpty: false, addAction } }));
		expect(one.body).toContain('<fieldset');
		expect(one.body).toContain('<legend class="giu-editable-list__legend');
		expect(one.body).toContain('Ordered images.');
		expect(one.body).toContain('<ol class="giu-editable-list__rows');
		expect(one.body).toContain('Consumer row');
		expect(one.body).not.toContain('No images.');
		expect(one.body).toContain('Add image');
	});

	test('renders empty content when isEmpty is true even if children are supplied', () => {
		const { body } = render(EditableList, { props: { legend: 'Gallery', children: row, empty, isEmpty: true, class: 'consumer-list', style: '--giu-editable-list-row-gap: 1rem' } });
		expect(body).toContain('No images.');
		expect(body).not.toContain('<ol');
		expect(body).toContain('consumer-list');
		expect(body).toContain('style="--giu-editable-list-row-gap: 1rem"');
	});

	test('renders a direct list item in visual position, fields, actions order and normalizes invalid positions to one', () => {
		const actions = createRawSnippet(() => ({ render: () => '<button type="button">Remove</button>' }));
		const { body } = render(EditableListRow, { props: { position: 0 as never, fields, actions, class: 'consumer-row', style: '--giu-editable-list-row-padding: 1rem' } });
		expect(body).toMatch(/^<!--[\s\S]*?<li /);
		expect(body).toContain('aria-hidden="true">1</span>');
		expect(body.indexOf('>1</span>')).toBeLessThan(body.indexOf('Title'));
		expect(body.indexOf('Title')).toBeLessThan(body.indexOf('Remove'));
		expect(body).toContain('consumer-row');
	});

	test('defaults both reorder controls to enabled and supports single-row boundaries', () => {
		const enabled = render(ReorderActions, {
			props: {
				moveUpLabel: 'Move item up',
				moveDownLabel: 'Move item down',
				onMoveUp: vi.fn(),
				onMoveDown: vi.fn()
			}
		});

		expect(enabled.body).not.toContain('disabled');

		const singleRow = render(ReorderActions, {
			props: {
				moveUpLabel: 'Move only item up',
				moveDownLabel: 'Move only item down',
				onMoveUp: vi.fn(),
				onMoveDown: vi.fn(),
				canMoveUp: false,
				canMoveDown: false
			}
		});

		expect(singleRow.body.match(/disabled/g)).toHaveLength(2);
	});

	test('renders reorder controls in order with exact labels, native type, boundaries and normalized size', () => {
		const up = vi.fn(); const down = vi.fn();
		const { body } = render(ReorderActions, { props: { moveUpLabel: 'Move first image up', moveDownLabel: 'Move first image down', onMoveUp: up, onMoveDown: down, canMoveUp: false, canMoveDown: true, size: 'large' as never, class: 'consumer-actions', style: '--giu-reorder-actions-gap: 1rem' } });
		expect(up).not.toHaveBeenCalled(); expect(down).not.toHaveBeenCalled();
		expect(body.indexOf('aria-label="Move first image up"')).toBeLessThan(body.indexOf('aria-label="Move first image down"'));
		expect(body.match(/type="button"/g)).toHaveLength(2);
		expect(body).toContain('disabled');
		expect(body).toContain('data-giu-size="default"');
		expect(body).not.toContain('large');
		expect(body).toContain('consumer-actions');
	});
});
