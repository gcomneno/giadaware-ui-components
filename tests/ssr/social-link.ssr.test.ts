import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';

import SocialLink from '../../src/lib/SocialLink.svelte';

const visibleLabel = createRawSnippet(() => ({
	render: () => '<span>GitHub profile</span>'
}));

describe('SocialLink SSR', () => {
	test('renders deterministic icon-only native anchor markup with one resolved name', () => {
		const props = {
			id: 'instagram' as const,
			href: '/instagram',
			label: '  Instagram profile  '
		};

		const first = render(SocialLink, { props });

		expect(first).toEqual(render(SocialLink, { props }));
		expect(first.body).toContain('<a');
		expect(first.body).toContain('href="/instagram"');
		expect(first.body).toContain('aria-label="Instagram profile"');
		expect(first.body).toContain('giu-social-link--icon-only');
		expect(first.body).toContain('<svg');
		expect(first.body).toContain('aria-hidden="true"');
		expect(first.body).not.toContain('<button');
	});

	test('uses visible child content as the name without duplicating ARIA naming', () => {
		const { body } = render(SocialLink, {
			props: {
				id: 'github',
				href: '/github',
				children: visibleLabel
			}
		});

		expect(body).toContain('GitHub profile');
		expect(body).toContain('giu-social-link--labelled');
		expect(body).not.toContain('aria-label=');
		expect(body).not.toContain('aria-labelledby=');
		expect(body).toContain('aria-hidden="true"');
	});

	test('forwards consumer navigation policy and applicable native attributes', () => {
		const onclick = vi.fn();
		const { body } = render(SocialLink, {
			props: {
				id: 'github-sponsors',
				href: 'https://example.test/sponsor',
				label: 'Sponsor',
				target: '_blank',
				rel: 'me noreferrer',
				referrerpolicy: 'no-referrer',
				'aria-describedby': 'sponsor-help',
				'data-analytics': 'sponsor',
				class: 'consumer-link',
				style: '--giu-social-link-gap: 1rem',
				onclick
			}
		});

		expect(onclick).not.toHaveBeenCalled();

		for (const attribute of [
			'target="_blank"',
			'rel="me noreferrer"',
			'referrerpolicy="no-referrer"',
			'aria-describedby="sponsor-help"',
			'data-analytics="sponsor"',
			'consumer-link',
			'style="--giu-social-link-gap: 1rem"'
		]) {
			expect(body).toContain(attribute);
		}
	});

	test('validates href without rewriting the consumer-owned value', () => {
		const href = ' /github?source=social#profile ';

		const { body } = render(SocialLink, {
			props: {
				id: 'github',
				href,
				label: 'GitHub profile'
			}
		});

		expect(body).toContain(
			'href=" /github?source=social#profile "'
		);
	});

	test('does not silently add target or rel', () => {
		const { body } = render(SocialLink, {
			props: {
				id: 'x',
				href: 'https://example.test/x',
				label: 'X profile'
			}
		});

		expect(body).not.toContain('target=');
		expect(body).not.toContain('rel=');
	});

	test('keeps the component name contract authoritative over untyped runtime overrides', () => {
		const iconOnly = render(SocialLink, {
			props: {
				id: 'facebook',
				href: '/facebook',
				label: 'Facebook profile',
				'aria-label': 'Runtime override',
				'aria-labelledby': 'runtime-name'
			} as never
		});

		const labelled = render(SocialLink, {
			props: {
				id: 'github',
				href: '/github',
				children: visibleLabel,
				label: 'Runtime duplicate',
				'aria-label': 'Runtime override',
				'aria-labelledby': 'runtime-name'
			} as never
		});

		expect(iconOnly.body).toContain('aria-label="Facebook profile"');
		expect(iconOnly.body).not.toContain('Runtime override');
		expect(iconOnly.body).not.toContain('aria-labelledby=');

		expect(labelled.body).toContain('GitHub profile');
		expect(labelled.body).not.toContain('Runtime duplicate');
		expect(labelled.body).not.toContain('Runtime override');
		expect(labelled.body).not.toContain('aria-label=');
		expect(labelled.body).not.toContain('aria-labelledby=');
	});

	test('fails closed for invalid href, icon-only name or identifier', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

		try {
			const missingHref = render(SocialLink, {
				props: {
					id: 'github',
					href: '   ',
					label: 'GitHub'
				}
			});
			const missingLabel = render(SocialLink, {
				props: {
					id: 'instagram',
					href: '/instagram',
					label: '   '
				}
			});
			const invalidId = render(SocialLink, {
				props: {
					id: 'linkedin',
					href: '/linkedin',
					label: 'LinkedIn'
				} as never
			});

			for (const result of [missingHref, missingLabel, invalidId]) {
				expect(result.body).not.toContain('<a');
			}
		} finally {
			warn.mockRestore();
		}
	});
});
