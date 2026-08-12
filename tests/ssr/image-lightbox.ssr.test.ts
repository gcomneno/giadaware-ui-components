import { render } from 'svelte/server';
import { expect, test, vi } from 'vitest';
import ImageLightbox from '../../src/lib/visitor/ImageLightbox.svelte';

const labels = {
	dialog: 'Image preview',
	close: 'Close image'
};

test('renders deterministic closed dialog markup for controlled false state', () => {
	const props = {
		open: false,
		onopenchange: vi.fn(),
		src: '/sample.jpg',
		alt: 'Sample image',
		labels
	};

	const first = render(ImageLightbox, { props });
	const second = render(ImageLightbox, { props });

	expect(first).toEqual(second);
	expect(first.body).toContain('<dialog');
	expect(first.body).toContain('aria-label="Image preview"');
	expect(first.body).toContain('src="/sample.jpg"');
	expect(first.body).toContain('alt="Sample image"');
	expect(first.body).toContain('Close image');
	expect(first.body).not.toMatch(/<dialog[^>]*\sopen(?:=|\s|>)/);
	expect(props.onopenchange).not.toHaveBeenCalled();
});

test('does not manufacture an SSR open attribute or run controlled callbacks', () => {
	const onopenchange = vi.fn();
	const body = render(ImageLightbox, {
		props: {
			open: true,
			onopenchange,
			src: '/open.jpg',
			alt: 'Open sample',
			labels
		}
	}).body;

	expect(body).not.toMatch(/<dialog[^>]*\sopen(?:=|\s|>)/);
	expect(onopenchange).not.toHaveBeenCalled();
});
