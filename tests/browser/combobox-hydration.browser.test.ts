import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	COMBOBOX_HYDRATION_SSR_BODY
} from '../fixtures/combobox-hydration-contract.js';
import ComboboxHydrationProbe from '../fixtures/ComboboxHydrationProbe.svelte';

test('hydrates Combobox without replacing nodes and preserves controlled interaction', async () => {
	const container = document.createElement('div');
	container.innerHTML =
		COMBOBOX_HYDRATION_SSR_BODY;
	document.body.append(container);

	const probe = container.querySelector(
		'[data-testid="combobox-hydration-probe"]'
	) as HTMLDivElement | null;
	const input = container.querySelector(
		'[role="combobox"]'
	) as HTMLInputElement | null;
	const listbox = container.querySelector(
		'[role="listbox"]'
	) as HTMLElement | null;
	const options = Array.from(
		container.querySelectorAll(
			'[role="option"]'
		)
	) as HTMLElement[];

	expect(probe).not.toBeNull();
	expect(input).not.toBeNull();
	expect(listbox).not.toBeNull();
	expect(options).toHaveLength(3);

	if (!probe || !input || !listbox) {
		throw new TypeError(
			'Expected server Combobox nodes.'
		);
	}

	const serverOptions = [...options];

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(ComboboxHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		expect(
			container.querySelector(
				'[data-testid="combobox-hydration-probe"]'
			)
		).toBe(probe);

		expect(
			container.querySelector(
				'[role="combobox"]'
			)
		).toBe(input);

		expect(
			container.querySelector(
				'[role="listbox"]'
			)
		).toBe(listbox);

		const hydratedOptions = Array.from(
			container.querySelectorAll(
				'[role="option"]'
			)
		);

		expect(hydratedOptions).toHaveLength(
			serverOptions.length
		);

		for (
			let index = 0;
			index < serverOptions.length;
			index += 1
		) {
			expect(
				hydratedOptions[index]
			).toBe(serverOptions[index]);
		}

		expect(probe).toHaveAttribute(
			'data-query',
			'Alpha'
		);
		expect(probe).toHaveAttribute(
			'data-value',
			'alpha'
		);
		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		input.focus();
		input.dispatchEvent(
			new KeyboardEvent(
				'keydown',
				{
					key: 'ArrowDown',
					bubbles: true
				}
			)
		);

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-expanded',
				'true'
			)
		);

		expect(input).toHaveAttribute(
			'aria-activedescendant',
			'hydration-combobox-option-0'
		);

		input.dispatchEvent(
			new KeyboardEvent(
				'keydown',
				{
					key: 'ArrowDown',
					bubbles: true
				}
			)
		);

		await vi.waitFor(() =>
			expect(input).toHaveAttribute(
				'aria-activedescendant',
				'hydration-combobox-option-1'
			)
		);

		input.dispatchEvent(
			new KeyboardEvent(
				'keydown',
				{
					key: 'Enter',
					bubbles: true
				}
			)
		);

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-value',
				'beta'
			)
		);

		expect(probe).toHaveAttribute(
			'data-value-requests',
			'1'
		);
		expect(input).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		expect(document.activeElement).toBe(input);

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
