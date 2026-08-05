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

	if (
		!(serverRoot instanceof HTMLElement) ||
		!(serverFieldset instanceof HTMLFieldSetElement) ||
		!(serverList instanceof HTMLOListElement) ||
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
		expect(serverFieldset.querySelector('legend')).toHaveTextContent('Gallery');
		expect(serverButtons[0]).toHaveAccessibleName('Move hero image up');
		expect(serverButtons[0]).toBeDisabled();
		expect(serverButtons[1]).toHaveAccessibleName('Move hero image down');
		expect(serverButtons[1]).not.toBeDisabled();

		serverButtons[1].click();

		await vi.waitFor(() =>
			expect(serverRoot).toHaveAttribute('data-move-count', '1')
		);

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
