import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import PageIntroHydrationProbe from '../fixtures/PageIntroHydrationProbe.svelte';
import { PAGE_INTRO_HYDRATION_SSR_BODY } from '../fixtures/page-intro-hydration-contract.js';

test('produces deterministic PageIntro hydration markup', () => {
	const first = render(PageIntroHydrationProbe);

	expect(first).toEqual(render(PageIntroHydrationProbe));
	expect(first.body).toBe(PAGE_INTRO_HYDRATION_SSR_BODY);
});
