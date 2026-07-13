import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import SocialIcon from '../../src/lib/SocialIcon.svelte';
import {
	SOCIAL_ICON_HYDRATION_PROPS,
	SOCIAL_ICON_SSR_BODY
} from '../fixtures/social-icon-hydration-contract.js';

test('hydrates SocialIcon without mismatch and reuses the server SVG', async () => {
	const container = document.createElement('div');
	container.innerHTML = SOCIAL_ICON_SSR_BODY;
	document.body.append(container);

	const serverSvg = container.querySelector('svg');

	expect(serverSvg).toBeInstanceOf(SVGSVGElement);

	const warnings: unknown[][] = [];
	const errors: unknown[][] = [];

	const warnSpy = vi
		.spyOn(console, 'warn')
		.mockImplementation((...args: unknown[]) => {
			warnings.push(args);
		});

	const errorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation((...args: unknown[]) => {
			errors.push(args);
		});

	let component: Record<string, unknown> | undefined;

	try {
		component = hydrate(SocialIcon, {
			target: container,
			props: SOCIAL_ICON_HYDRATION_PROPS,
			recover: false
		});

		await tick();

		const hydratedSvg = container.querySelector('svg');

		expect(hydratedSvg).toBe(serverSvg);
		expect(hydratedSvg?.getAttribute('role')).toBe('img');
		expect(hydratedSvg?.getAttribute('aria-label')).toBe(
			'Supporta su GitHub Sponsors'
		);
		expect(hydratedSvg?.getAttribute('width')).toBe('28px');
		expect(hydratedSvg?.getAttribute('height')).toBe('28px');
		expect(hydratedSvg?.querySelector('title')?.textContent).toBe(
			'GitHub Sponsors'
		);
		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		await unmount(component);
		component = undefined;

		expect(container.querySelector('svg')).toBeNull();
	} finally {
		if (component) {
			await unmount(component);
		}

		warnSpy.mockRestore();
		errorSpy.mockRestore();
		container.remove();
	}
});
