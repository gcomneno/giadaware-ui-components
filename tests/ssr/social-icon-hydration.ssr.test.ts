import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import SocialIcon from '../../src/lib/SocialIcon.svelte';
import {
	SOCIAL_ICON_HYDRATION_PROPS,
	SOCIAL_ICON_SSR_BODY
} from '../fixtures/social-icon-hydration-contract.js';

test('produces the shared SocialIcon hydration contract', () => {
	const first = render(SocialIcon, {
		props: SOCIAL_ICON_HYDRATION_PROPS
	});
	const second = render(SocialIcon, {
		props: SOCIAL_ICON_HYDRATION_PROPS
	});

	expect(first.body).toBe(SOCIAL_ICON_SSR_BODY);
	expect(second.body).toBe(SOCIAL_ICON_SSR_BODY);
	expect(first.head).toBe('');
	expect(second.head).toBe('');
});
