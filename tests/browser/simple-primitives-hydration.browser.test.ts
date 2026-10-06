import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import {
	SIMPLE_PRIMITIVES_HYDRATION_SSR_BODY
} from '../fixtures/simple-primitives-hydration-contract.js';
import SimplePrimitivesHydrationProbe from '../fixtures/SimplePrimitivesHydrationProbe.svelte';

test('hydrates simple primitives without replacing native control nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML =
		SIMPLE_PRIMITIVES_HYDRATION_SSR_BODY;
	document.body.append(container);

	const probe = container.querySelector(
		'[data-testid="simple-primitives-hydration-probe"]'
	) as HTMLDivElement | null;
	const input = container.querySelector(
		'#hydration-text'
	) as HTMLInputElement | null;
	const textarea = container.querySelector(
		'#hydration-textarea'
	) as HTMLTextAreaElement | null;
	const select = container.querySelector(
		'#hydration-select'
	) as HTMLSelectElement | null;
	const details = container.querySelector(
		'[data-testid="hydration-disclosure"]'
	) as HTMLDetailsElement | null;

	if (
		!probe ||
		!input ||
		!textarea ||
		!select ||
		!details
	) {
		throw new TypeError(
			'Expected server-rendered simple primitive nodes.'
		);
	}

	const warn = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => {});
	const error = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(
			SimplePrimitivesHydrationProbe,
			{
				target: container,
				recover: false
			}
		);

		await tick();

		expect(
			container.querySelector(
				'#hydration-text'
			)
		).toBe(input);

		expect(
			container.querySelector(
				'#hydration-textarea'
			)
		).toBe(textarea);

		expect(
			container.querySelector(
				'#hydration-select'
			)
		).toBe(select);

		expect(
			container.querySelector(
				'[data-testid="hydration-disclosure"]'
			)
		).toBe(details);

		expect(probe).toHaveAttribute(
			'data-text',
			'server text'
		);
		expect(probe).toHaveAttribute(
			'data-textarea',
			'server notes'
		);
		expect(probe).toHaveAttribute(
			'data-select',
			'beta'
		);
		expect(probe).toHaveAttribute(
			'data-open',
			'true'
		);

		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		input.value = 'client text';
		input.dispatchEvent(
			new Event(
				'input',
				{ bubbles: true }
			)
		);

		textarea.value = 'client notes';
		textarea.dispatchEvent(
			new Event(
				'input',
				{ bubbles: true }
			)
		);

		select.value = 'alpha';
		select.dispatchEvent(
			new Event(
				'change',
				{ bubbles: true }
			)
		);

		const summary = details.querySelector(
			'summary'
		);

		if (!(summary instanceof HTMLElement)) {
			throw new TypeError(
				'Expected hydrated summary.'
			);
		}

		summary.click();

		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-text',
				'client text'
			)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-textarea',
				'client notes'
			)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-select',
				'alpha'
			)
		);
		await vi.waitFor(() =>
			expect(probe).toHaveAttribute(
				'data-open',
				'false'
			)
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
