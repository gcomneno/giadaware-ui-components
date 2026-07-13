import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';

import SocialIcon from '../../src/lib/SocialIcon.svelte';
import { SOCIAL_ICON_IDS } from '../../src/lib/social-icon.js';

import type { SocialIconId } from '../../src/lib/social-icon.js';

describe('SocialIcon SSR', () => {
	test('produces deterministic SVG markup', () => {
		const props = {
			id: 'instagram' as const
		};

		const first = render(SocialIcon, { props });
		const second = render(SocialIcon, { props });

		expect(first.body).toBe(second.body);
		expect(first.head).toBe(second.head);
		expect(first.body).toContain('<svg');
		expect(first.body).toContain('viewBox="0 0 24 24"');
		expect(first.body).toContain('fill="currentColor"');
		expect(first.body).toContain('width="24px"');
		expect(first.body).toContain('height="24px"');
		expect(first.head).toBe('');
	});

	test('renders one distinct path for every supported identifier', () => {
		const paths = SOCIAL_ICON_IDS.map((id) => {
			const result = render(SocialIcon, {
				props: { id }
			});

			const match = result.body.match(/<path d="([^"]+)"/);

			expect(match, `Missing path for ${id}`).not.toBeNull();

			return match?.[1];
		});

		expect(new Set(paths).size).toBe(SOCIAL_ICON_IDS.length);
	});

	test('renders GitHub and GitHub Sponsors as different glyphs', () => {
		const github = render(SocialIcon, {
			props: { id: 'github' }
		});
		const sponsors = render(SocialIcon, {
			props: { id: 'github-sponsors' }
		});

		expect(github.body).not.toBe(sponsors.body);
		expect(github.body).not.toContain(
			'M14 20.408c-.492.308'
		);
		expect(sponsors.body).toContain(
			'M14 20.408c-.492.308'
		);
	});

	test('is decorative by default', () => {
		const result = render(SocialIcon, {
			props: {
				id: 'facebook',
				ariaLabel: 'Ignored label',
				title: 'Ignored title'
			}
		});

		expect(result.body).toContain('aria-hidden="true"');
		expect(result.body).not.toContain('role="img"');
		expect(result.body).not.toContain('aria-label=');
		expect(result.body).not.toContain('<title>');
	});

	test('supports an informative accessible name and title', () => {
		const result = render(SocialIcon, {
			props: {
				id: 'github',
				decorative: false,
				ariaLabel: 'Profilo GitHub',
				title: 'GitHub'
			}
		});

		expect(result.body).toContain('role="img"');
		expect(result.body).toContain(
			'aria-label="Profilo GitHub"'
		);
		expect(result.body).toContain('<title>GitHub</title>');
		expect(result.body).not.toContain('aria-hidden=');
	});

	test('does not render an informative icon without a label', () => {
		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		try {
			const missing = render(SocialIcon, {
				props: {
					id: 'x',
					decorative: false
				}
			});
			const blank = render(SocialIcon, {
				props: {
					id: 'facebook',
					decorative: false,
					ariaLabel: '   '
				}
			});

			expect(missing.body).not.toContain('<svg');
			expect(blank.body).not.toContain('<svg');
		} finally {
			warnSpy.mockRestore();
		}
	});

	test('applies size and per-axis overrides', () => {
		const sized = render(SocialIcon, {
			props: {
				id: 'instagram',
				size: 32
			}
		});
		const overridden = render(SocialIcon, {
			props: {
				id: 'instagram',
				size: '3rem',
				width: '2rem',
				height: 18
			}
		});

		expect(sized.body).toContain('width="32px"');
		expect(sized.body).toContain('height="32px"');
		expect(overridden.body).toContain('width="2rem"');
		expect(overridden.body).toContain('height="18px"');
	});

	test('forwards class and inline style to the SVG', () => {
		const result = render(SocialIcon, {
			props: {
				id: 'github-sponsors',
				class: 'social-link__icon',
				style: 'color: rebeccapurple'
			}
		});

		expect(result.body).toContain(
			'class="social-link__icon"'
		);
		expect(result.body).toContain(
			'style="color: rebeccapurple"'
		);
		expect(result.body).toContain('fill="currentColor"');
	});

	test('does not render an invalid runtime identifier and warns once', () => {
		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		try {
			const invalidId =
				'invalid-social-icon-test' as SocialIconId;

			const first = render(SocialIcon, {
				props: { id: invalidId }
			});
			const second = render(SocialIcon, {
				props: { id: invalidId }
			});

			expect(first.body).not.toContain('<svg');
			expect(second.body).not.toContain('<svg');
			expect(warnSpy).toHaveBeenCalledTimes(1);
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					'unsupported id "invalid-social-icon-test"'
				)
			);
		} finally {
			warnSpy.mockRestore();
		}
	});
});
