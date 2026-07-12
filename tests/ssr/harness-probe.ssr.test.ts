import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';

import HarnessProbe from '../fixtures/HarnessProbe.svelte';

describe('HarnessProbe SSR', () => {
	test('produces deterministic server-rendered HTML', () => {
		const props = {
			message: 'GiadaWare SSR harness ready'
		};

		const first = render(HarnessProbe, { props });
		const second = render(HarnessProbe, { props });

		expect(first.body).toBe(second.body);
		expect(first.head).toBe(second.head);
		expect(first.body).toContain(
			'data-testid="harness-probe"'
		);
		expect(first.body).toContain(
			'aria-labelledby="harness-probe-title"'
		);
		expect(first.body).toContain(
			'<h1 id="harness-probe-title">GiadaWare SSR harness ready</h1>'
		);
		expect(first.head).toBe('');
	});
});
