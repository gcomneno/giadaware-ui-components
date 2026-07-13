import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import SocialIcon from '../../src/lib/SocialIcon.svelte';
import { SOCIAL_ICON_IDS } from '../../src/lib/social-icon.js';

import type { SocialIconId } from '../../src/lib/social-icon.js';

test.each(SOCIAL_ICON_IDS)(
	'renders the %s glyph in Chromium',
	async (id) => {
		await render(SocialIcon, { id });

		const svg = document.querySelector('svg');
		const path = svg?.querySelector('path');

		expect(svg).toBeInstanceOf(SVGSVGElement);
		expect(path).toBeInstanceOf(SVGPathElement);
		expect(path?.getAttribute('d')).toBeTruthy();
		expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
		expect(svg?.getAttribute('fill')).toBe('currentColor');
	}
);

test('renders GitHub and GitHub Sponsors as different glyphs', async () => {
	const github = await render(SocialIcon, {
		id: 'github'
	});

	const githubPath = document
		.querySelector('svg path')
		?.getAttribute('d');

	await github.unmount();

	await render(SocialIcon, {
		id: 'github-sponsors'
	});

	const sponsorsPath = document
		.querySelector('svg path')
		?.getAttribute('d');

	expect(githubPath).toBeTruthy();
	expect(sponsorsPath).toBeTruthy();
	expect(githubPath).not.toBe(sponsorsPath);
});

test('is decorative by default', async () => {
	await render(SocialIcon, {
		id: 'facebook',
		ariaLabel: 'Ignored label',
		title: 'Ignored title'
	});

	const svg = document.querySelector('svg');

	expect(svg?.getAttribute('aria-hidden')).toBe('true');
	expect(svg?.hasAttribute('role')).toBe(false);
	expect(svg?.hasAttribute('aria-label')).toBe(false);
	expect(svg?.querySelector('title')).toBeNull();
});

test('supports informative accessibility semantics', async () => {
	await render(SocialIcon, {
		id: 'github',
		decorative: false,
		ariaLabel: 'Profilo GitHub',
		title: 'GitHub'
	});

	const svg = document.querySelector('svg');

	expect(svg?.getAttribute('role')).toBe('img');
	expect(svg?.getAttribute('aria-label')).toBe(
		'Profilo GitHub'
	);
	expect(svg?.getAttribute('aria-hidden')).toBeNull();
	expect(svg?.querySelector('title')?.textContent).toBe(
		'GitHub'
	);
});

test('inherits color and applies dimensions and approved attributes', async () => {
	await render(SocialIcon, {
		id: 'instagram',
		size: '3rem',
		width: '2rem',
		height: 18,
		class: 'social-link__icon',
		style: 'color: rgb(12, 34, 56)'
	});

	const svg = document.querySelector('svg');

	expect(svg).toBeInstanceOf(SVGSVGElement);
	expect(svg?.getAttribute('width')).toBe('2rem');
	expect(svg?.getAttribute('height')).toBe('18px');
	expect(svg?.getAttribute('class')).toBe(
		'social-link__icon'
	);
	expect(svg?.getAttribute('fill')).toBe('currentColor');

	if (!(svg instanceof SVGSVGElement)) {
		throw new TypeError('SocialIcon SVG was not rendered.');
	}

	expect(getComputedStyle(svg).color).toBe(
		'rgb(12, 34, 56)'
	);
	expect(getComputedStyle(svg).fill).toBe(
		'rgb(12, 34, 56)'
	);
});

test('does not render an informative icon without ariaLabel', async () => {
	const warnSpy = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => undefined);

	try {
		await render(SocialIcon, {
			id: 'x',
			decorative: false,
			ariaLabel: '   '
		});

		expect(document.querySelector('svg')).toBeNull();
		expect(warnSpy).toHaveBeenCalledTimes(1);
	} finally {
		warnSpy.mockRestore();
	}
});

test('does not render an invalid runtime identifier and warns once', async () => {
	const warnSpy = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => undefined);

	try {
		const invalidId =
			'invalid-social-icon-browser-test' as SocialIconId;

		const first = await render(SocialIcon, {
			id: invalidId
		});

		expect(document.querySelector('svg')).toBeNull();

		await first.unmount();

		await render(SocialIcon, {
			id: invalidId
		});

		expect(document.querySelector('svg')).toBeNull();
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				'unsupported id "invalid-social-icon-browser-test"'
			)
		);
	} finally {
		warnSpy.mockRestore();
	}
});
