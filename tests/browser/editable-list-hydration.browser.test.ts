import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';

import { EDITABLE_LIST_HYDRATION_SSR_BODY } from '../fixtures/editable-list-hydration-contract.js';
import EditableListHydrationProbe from '../fixtures/EditableListHydrationProbe.svelte';

test('hydrates editable-list primitives without replacement or mismatch', async () => {
	const container = document.createElement('div');
	container.innerHTML = EDITABLE_LIST_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="editable-list-hydration-probe"]');
	const serverFieldset = container.querySelector('fieldset');
	const serverList = container.querySelector('ol');
	const serverRows = [...container.querySelectorAll('ol > li')];
	const serverButtons = [...container.querySelectorAll('button')];
	const serverDescription = container.querySelector(
		'#hero-image-reorder-context'
	);

	if (
		!(serverRoot instanceof HTMLElement) ||
		!(serverFieldset instanceof HTMLFieldSetElement) ||
		!(serverList instanceof HTMLOListElement) ||
		!(serverDescription instanceof HTMLElement) ||
		serverRows.length !== 1 ||
		serverButtons.length !== 2
	) {
		throw new TypeError('Server EditableList hydration content missing');
	}

	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(EditableListHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(container.querySelector('[data-testid="editable-list-hydration-probe"]')).toBe(serverRoot);
		expect(container.querySelector('fieldset')).toBe(serverFieldset);
		expect(container.querySelector('ol')).toBe(serverList);
		expect([...container.querySelectorAll('ol > li')]).toEqual(serverRows);
		expect([...container.querySelectorAll('button')]).toEqual(serverButtons);
		expect(container.querySelector('#hero-image-reorder-context')).toBe(serverDescription);
		expect(serverFieldset.querySelector('legend')).toHaveTextContent('Gallery');
		expect(serverDescription).toHaveTextContent('Hero image, position 1 of 3');
		expect(serverDescription).not.toHaveAttribute('aria-live');
		expect(serverButtons[0]).toHaveAccessibleName('Move hero image up');
		expect(serverButtons[0]).toHaveAttribute('aria-describedby', 'hero-image-reorder-context');
		expect(serverButtons[0]).toBeDisabled();
		expect(serverButtons[1]).toHaveAccessibleName('Move hero image down');
		expect(serverButtons[1]).toHaveAttribute('aria-describedby', 'hero-image-reorder-context');
		expect(serverButtons[1]).not.toBeDisabled();

		serverButtons[1].click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-move-count', '1')
		);
		expect(serverDescription).toHaveTextContent('Hero image, position 2 of 3');
		expect(serverDescription).toHaveAttribute('id', 'hero-image-reorder-context');

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) {
			await unmount(component);
		}

		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
