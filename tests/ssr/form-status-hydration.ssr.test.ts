import { render } from 'svelte/server';
import { expect, test, vi } from 'vitest';

import FormStatus from '../../src/lib/FormStatus.svelte';
import {
	FORM_STATUS_HYDRATION_PROPS,
	FORM_STATUS_SSR_BODY
} from '../fixtures/form-status-hydration-contract.js';

test('produces the shared FormStatus hydration contract without a timer', () => {
	const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

	try {
		const first = render(FormStatus, {
			props: FORM_STATUS_HYDRATION_PROPS
		});
		const second = render(FormStatus, {
			props: FORM_STATUS_HYDRATION_PROPS
		});

		expect(first.body).toBe(FORM_STATUS_SSR_BODY);
		expect(second.body).toBe(FORM_STATUS_SSR_BODY);
		expect(first.head).toBe('');
		expect(second.head).toBe('');
		expect(setTimeoutSpy).not.toHaveBeenCalled();
	} finally {
		setTimeoutSpy.mockRestore();
	}
});
