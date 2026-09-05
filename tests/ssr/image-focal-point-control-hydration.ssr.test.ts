import { render } from 'svelte/server';
import { expect, test } from 'vitest';

import ImageFocalPointControlHydrationProbe from '../fixtures/ImageFocalPointControlHydrationProbe.svelte';
import { IMAGE_FOCAL_POINT_CONTROL_HYDRATION_SSR_BODY } from '../fixtures/image-focal-point-control-hydration-contract.js';

test('renders the deterministic ImageFocalPointControl hydration contract', () => {
	const first = render(ImageFocalPointControlHydrationProbe);
	const second = render(ImageFocalPointControlHydrationProbe);

	expect(first.body).toBe(IMAGE_FOCAL_POINT_CONTROL_HYDRATION_SSR_BODY);
	expect(second.body).toBe(IMAGE_FOCAL_POINT_CONTROL_HYDRATION_SSR_BODY);
});
