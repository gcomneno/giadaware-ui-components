import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import SocialLinkProbe from '../fixtures/SocialLinkProbe.svelte';

test('keeps social-link naming singular and passes Axe', async () => {
	const screen = await render(SocialLinkProbe);
	const root = screen.getByTestId('social-link-probe').element() as HTMLElement;

	const instagram = screen.getByRole('link', {
		name: 'Instagram profile'
	});
	const github = screen.getByRole('link', {
		name: 'GitHub profile'
	});

	(instagram.element() as HTMLAnchorElement).focus();
	expect(instagram).toHaveFocus();

	expect(instagram).toHaveAttribute(
		'aria-label',
		'Instagram profile'
	);
	expect(github).not.toHaveAttribute('aria-label');
	expect(github).not.toHaveAttribute('aria-labelledby');

	for (const svg of root.querySelectorAll('svg')) {
		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(svg).not.toHaveAttribute('role');
		expect(svg).not.toHaveAttribute('aria-label');
	}

	expect(root.querySelector('button')).toBeNull();
	expect((await axe.run(root)).violations).toHaveLength(0);
});
