import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import HarnessProbe from '../fixtures/HarnessProbe.svelte';

test('renders a Svelte component inside Chromium', async () => {
	const screen = await render(HarnessProbe, {
		message: 'GiadaWare test harness ready'
	});

	const heading = screen.getByRole('heading', {
		name: 'GiadaWare test harness ready'
	});

	await expect.element(heading).toBeInTheDocument();
});
