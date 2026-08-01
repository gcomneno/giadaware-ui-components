import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import SurfaceProbe from '../fixtures/SurfaceProbe.svelte';

test('renders neutral surfaces and preserves consumer-owned behavior', async () => {
	await render(SurfaceProbe);

	const root = document.querySelector('[data-testid="surface-probe"]');
	if (!(root instanceof HTMLElement)) {
		throw new TypeError('Surface probe missing');
	}

	const surfaces = [...root.querySelectorAll<HTMLElement>('.giu-surface')];

	expect(surfaces).toHaveLength(2);

	for (const surface of surfaces) {
		expect(surface.tagName).toBe('DIV');
		expect(surface).not.toHaveAttribute('role');
		expect(surface).not.toHaveAttribute('aria-label');
		expect(surface).not.toHaveAttribute('aria-labelledby');
		expect(surface.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull();
	}

	const form = root.querySelector('[data-testid="surface-form"]');
	const nav = root.querySelector('nav[aria-label="Resources"]');
	const complete = root.querySelector('.consumer-surface');
	const link = root.querySelector('[data-testid="surface-link"]');

	if (
		!(form instanceof HTMLFormElement) ||
		!(nav instanceof HTMLElement) ||
		!(complete instanceof HTMLElement) ||
		!(link instanceof HTMLAnchorElement)
	) {
		throw new TypeError('Surface consumer content missing');
	}

	expect(surfaces[0].contains(form)).toBe(true);
	expect(nav.contains(complete)).toBe(true);
	expect(complete).toHaveClass('giu-surface');
	expect(complete).toHaveClass('consumer-surface');
	expect(complete).toHaveStyle('--giu-surface-padding: 2rem');
	expect(complete).toHaveStyle('max-width: 30rem');

	form.requestSubmit();

	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-action-count', '1'),
	);

	link.click();

	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-action-count', '2'),
	);
});
