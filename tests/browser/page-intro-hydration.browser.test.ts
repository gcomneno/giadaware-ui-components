import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import PageIntroHydrationProbe from '../fixtures/PageIntroHydrationProbe.svelte';
import { PAGE_INTRO_HYDRATION_SSR_BODY } from '../fixtures/page-intro-hydration-contract.js';

test('hydrates deterministic paragraph and link nodes without replacement or mismatch', async () => {
	const container = document.createElement('div');
	container.innerHTML = PAGE_INTRO_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="page-intro-hydration-probe"]');
	const serverParagraphs = [...container.querySelectorAll('p')];
	const serverLink = container.querySelector('a');
	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(PageIntroHydrationProbe, { target: container, recover: false });
		await tick();

		expect(container.querySelector('[data-testid="page-intro-hydration-probe"]')).toBe(serverRoot);
		expect([...container.querySelectorAll('p')]).toEqual(serverParagraphs);
		expect(container.querySelector('a')).toBe(serverLink);
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
