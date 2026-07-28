import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PageIntroProbe from '../fixtures/PageIntroProbe.svelte';

test('renders plain and mixed introductory content with consumer styling', async () => {
	const screen = await render(PageIntroProbe);
	const root = screen.getByTestId('page-intro-probe').element() as HTMLElement;
	const paragraphs = [...root.querySelectorAll('p')];

	expect(paragraphs).toHaveLength(2);
	expect(paragraphs[0]).toHaveClass('giu-page-intro', 'consumer-intro');
	expect(paragraphs[0]).toHaveTextContent('Manage the current document and open its preview.');
	expect(paragraphs[1]).toHaveTextContent('Plain introductory content.');

	const link = screen.getByRole('link', { name: 'open its preview' });
	expect(link).toHaveAttribute('href', '/preview');
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noreferrer');
});

test('applies documented custom properties without changing native semantics', async () => {
	const screen = await render(PageIntroProbe);
	const root = screen.getByTestId('page-intro-probe').element() as HTMLElement;
	const intro = root.querySelector('.consumer-intro') as HTMLParagraphElement;
	const link = screen.getByRole('link', { name: 'open its preview' }).element() as HTMLAnchorElement;
	const introStyle = getComputedStyle(intro);
	const linkStyle = getComputedStyle(link);

	expect(intro.tagName).toBe('P');
	expect(introStyle.getPropertyValue('--giu-page-intro-margin')).toBe('0');
	expect(introStyle.getPropertyValue('--giu-page-intro-color')).toBe('rgb(32, 32, 32)');
	expect(introStyle.getPropertyValue('--giu-page-intro-line-height')).toBe('1.75');
	expect(introStyle.getPropertyValue('--giu-page-intro-link-color')).toBe('rgb(21, 89, 166)');
	expect(introStyle.marginTop).toBe('0px');
	expect(introStyle.marginRight).toBe('0px');
	expect(introStyle.marginBottom).toBe('0px');
	expect(introStyle.marginLeft).toBe('0px');
	expect(introStyle.color).toBe('rgb(32, 32, 32)');
	expect(Number.parseFloat(introStyle.lineHeight)).toBeGreaterThan(0);
	expect(linkStyle.color).toBe('rgb(21, 89, 166)');
});
