import axe from 'axe-core';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PageIntroProbe from '../fixtures/PageIntroProbe.svelte';

test('preserves paragraph and link semantics without synthetic accessibility behavior', async () => {
	const screen = await render(PageIntroProbe);
	const root = screen.getByTestId('page-intro-probe').element() as HTMLElement;
	const paragraphs = [...root.querySelectorAll('p')];

	expect(paragraphs).toHaveLength(2);
	expect(root.querySelector('[role], [aria-live], [aria-atomic]')).toBeNull();
	expect(screen.getByRole('link', { name: 'open its preview' })).toHaveAttribute('href', '/preview');
	expect((await axe.run(root)).violations).toHaveLength(0);
});
