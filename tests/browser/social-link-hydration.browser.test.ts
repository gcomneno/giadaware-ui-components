import {
	hydrate,
	tick,
	unmount
} from 'svelte';
import { expect, test, vi } from 'vitest';

import SocialLinkHydrationProbe from '../fixtures/SocialLinkHydrationProbe.svelte';
import { SOCIAL_LINK_HYDRATION_SSR_BODY } from '../fixtures/social-link-hydration-contract.js';

test('hydrates SocialLink anchors without mismatch and reuses the server nodes', async () => {
	const container = document.createElement('div');
	container.innerHTML = SOCIAL_LINK_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector(
		'[data-testid="social-link-hydration-probe"]'
	);
	const serverLinks = [...container.querySelectorAll('a')];

	expect(serverRoot).toBeInstanceOf(HTMLElement);
	expect(serverLinks).toHaveLength(2);

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
		component = hydrate(SocialLinkHydrationProbe, {
			target: container,
			recover: false
		});

		await tick();

		const hydratedRoot = container.querySelector(
			'[data-testid="social-link-hydration-probe"]'
		);
		const hydratedLinks = [...container.querySelectorAll('a')];

		expect(hydratedRoot).toBe(serverRoot);
		expect(hydratedLinks).toHaveLength(2);
		expect(hydratedLinks[0]).toBe(serverLinks[0]);
		expect(hydratedLinks[1]).toBe(serverLinks[1]);

		expect(hydratedLinks[0]).toHaveAttribute(
			'aria-label',
			'Instagram profile'
		);
		expect(hydratedLinks[0]).toHaveAttribute(
			'aria-describedby',
			'instagram-help'
		);
		expect(hydratedLinks[0]).not.toHaveAttribute('target');
		expect(hydratedLinks[0]).not.toHaveAttribute('rel');

		expect(hydratedLinks[1]).not.toHaveAttribute('aria-label');
		expect(hydratedLinks[1]).not.toHaveAttribute('aria-labelledby');
		expect(hydratedLinks[1]).toHaveAttribute('target', '_blank');
		expect(hydratedLinks[1]).toHaveAttribute('rel', 'me noreferrer');

		for (const link of hydratedLinks) {
			const svg = link.querySelector('svg');

			expect(svg).toBeInstanceOf(SVGSVGElement);
			expect(svg).toHaveAttribute('aria-hidden', 'true');
		}

		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		(hydratedLinks[0] as HTMLAnchorElement).click();
		await tick();

		expect(hydratedRoot).toHaveAttribute(
			'data-activation-count',
			'1'
		);

		(hydratedLinks[1] as HTMLAnchorElement).click();
		await tick();

		expect(hydratedRoot).toHaveAttribute(
			'data-activation-count',
			'11'
		);

		expect(warnings).toEqual([]);
		expect(errors).toEqual([]);

		await unmount(component);
		component = undefined;

		expect(
			container.querySelector(
				'[data-testid="social-link-hydration-probe"]'
			)
		).toBeNull();
	} finally {
		if (component) {
			await unmount(component);
		}

		warnSpy.mockRestore();
		errorSpy.mockRestore();
		container.remove();
	}
});
