import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import SocialLinkHydrationProbe from '../fixtures/SocialLinkHydrationProbe.svelte';
import { SOCIAL_LINK_HYDRATION_SSR_BODY } from '../fixtures/social-link-hydration-contract.js';

test('produces the shared deterministic SocialLink hydration contract', () => {
	const first = render(SocialLinkHydrationProbe);
	const second = render(SocialLinkHydrationProbe);

	expect(first.body).toBe(SOCIAL_LINK_HYDRATION_SSR_BODY);
	expect(second.body).toBe(SOCIAL_LINK_HYDRATION_SSR_BODY);
	expect(first.head).toBe('');
	expect(second.head).toBe('');
});
