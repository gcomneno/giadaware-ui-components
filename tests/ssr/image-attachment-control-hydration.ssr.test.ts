import { render } from 'svelte/server';
import { expect, test, vi } from 'vitest';

import ImageAttachmentControlHydrationProbe from '../fixtures/ImageAttachmentControlHydrationProbe.svelte';
import { IMAGE_ATTACHMENT_CONTROL_HYDRATION_SSR_BODY } from '../fixtures/image-attachment-control-hydration-contract.js';

test('produces the exact shared hydration body without browser-only work', () => {
	const createObjectURL = vi.spyOn(URL, 'createObjectURL');
	const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL');
	try {
		const first = render(ImageAttachmentControlHydrationProbe);
		const second = render(ImageAttachmentControlHydrationProbe);
		expect(first.body).toBe(IMAGE_ATTACHMENT_CONTROL_HYDRATION_SSR_BODY);
		expect(second.body).toBe(IMAGE_ATTACHMENT_CONTROL_HYDRATION_SSR_BODY);
		expect(first.head).toBe('');
		expect(second.head).toBe('');
		expect(first.body).toContain('data-change-count="0"');
		expect(createObjectURL).not.toHaveBeenCalled();
		expect(revokeObjectURL).not.toHaveBeenCalled();
	} finally {
		createObjectURL.mockRestore();
		revokeObjectURL.mockRestore();
	}
});
