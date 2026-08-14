import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import SocialLink from '../../src/lib/SocialLink.svelte';
import SocialLinkProbe from '../fixtures/SocialLinkProbe.svelte';

test('preserves native pointer, keyboard and forwarded anchor behavior', async () => {
	const screen = await render(SocialLinkProbe);
	const root = screen.getByTestId('social-link-probe');
	const instagram = screen.getByRole('link', {
		name: 'Instagram profile'
	});
	const github = screen.getByRole('link', {
		name: 'GitHub profile'
	});

	expect(instagram).toHaveAttribute('href', '/instagram');
	expect(instagram).toHaveAttribute(
		'aria-describedby',
		'instagram-help'
	);
	expect(instagram).toHaveAttribute('data-consumer', 'forwarded');
	expect(instagram).toHaveClass('giu-social-link', 'consumer-social-link');
	expect(instagram).toHaveStyle('--giu-social-link-gap: 0.75rem');

	expect(github).toHaveAttribute('href', '/github');
	expect(github).toHaveAttribute('target', '_blank');
	expect(github).toHaveAttribute('rel', 'me noreferrer');
	expect(github).not.toHaveAttribute('aria-label');

	for (const link of [instagram, github]) {
		const svg = link.element().querySelector('svg');
		expect(svg).toBeInstanceOf(SVGSVGElement);
		expect(svg).toHaveAttribute('aria-hidden', 'true');
	}

	await instagram.click();
	expect(root).toHaveAttribute('data-count', '1');

	(github.element() as HTMLAnchorElement).focus();
	await userEvent.keyboard('{Enter}');
	await vi.waitFor(() =>
		expect(root).toHaveAttribute('data-count', '11')
	);
});

test('does not invent external-link policy', async () => {
	const screen = await render(SocialLink, {
		id: 'x',
		href: 'https://example.test/x',
		label: 'X profile'
	});

	const link = screen.getByRole('link', { name: 'X profile' });

	expect(link).not.toHaveAttribute('target');
	expect(link).not.toHaveAttribute('rel');
});

test('keeps naming overrides from untyped runtime props non-authoritative', async () => {
	const screen = await render(SocialLink, {
		id: 'facebook',
		href: '/facebook',
		label: 'Facebook profile',
		'aria-label': 'Runtime override',
		'aria-labelledby': 'runtime-name'
	} as never);

	const link = screen.getByRole('link', {
		name: 'Facebook profile'
	});

	expect(link).toHaveAttribute('aria-label', 'Facebook profile');
	expect(link).not.toHaveAttribute('aria-labelledby');
});
