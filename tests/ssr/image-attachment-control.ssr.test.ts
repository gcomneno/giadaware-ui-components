import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';

import ImageAttachmentControl from '../../src/lib/studio/ImageAttachmentControl.svelte';
import { createImageAttachmentState } from '../../src/lib/studio/image-attachment-control.js';

import type { ImageAttachmentControlLabels, ImageAttachmentState } from '../../src/lib/studio/image-attachment-control.js';

const labels: ImageAttachmentControlLabels = {
	input: 'Choose image', cancelReplacement: 'Cancel replacement', remove: 'Remove image',
	cancelRemoval: 'Cancel removal', keepExistingStatus: 'Existing image kept',
	keepEmptyStatus: 'No image selected', replaceStatus: 'Replacement selected',
	removeStatus: 'Image will be removed', replacementPreviewAlt: 'Replacement preview'
};

function props(value: ImageAttachmentState = createImageAttachmentState()) {
	return { value, onvaluechange: vi.fn(), invalidTypeMessage: 'Wrong type', tooLargeMessage: 'Too large', labels };
}

describe('ImageAttachmentControl SSR', () => {
	test('renders deterministic keep markup without a current image', () => {
		const options = { props: props() };
		expect(render(ImageAttachmentControl, options)).toEqual(render(ImageAttachmentControl, options));
		const { body } = render(ImageAttachmentControl, options);
		expect(body).toContain('data-intent="keep"');
		expect(body).toContain('No image selected');
		expect(body).not.toContain('<img');
		expect(body).not.toContain('Remove image');
	});

	test('renders deterministic keep markup with the caller current image', () => {
		const options = { props: { ...props(), currentImage: { src: '/photo.jpg', alt: 'Portrait', name: 'photo.jpg' } } };
		const first = render(ImageAttachmentControl, options);
		expect(first).toEqual(render(ImageAttachmentControl, options));
		expect(first.body).toContain('src="/photo.jpg"');
		expect(first.body).toContain('alt="Portrait"');
		expect(first.body).toContain('photo.jpg');
		expect(first.body).toContain('Existing image kept');
		expect(first.body).toContain('Remove image');
	});

	test('renders a deterministic replacement placeholder without object URL calls', () => {
		const file = new File(['x'], 'new.png', { type: 'image/png' });
		const create = vi.fn();
		const originalUrl = globalThis.URL;
		Object.defineProperty(globalThis, 'URL', { configurable: true, value: { createObjectURL: create, revokeObjectURL: vi.fn() } });
		try {
			const { body } = render(ImageAttachmentControl, { props: props({ intent: 'replace', file }) });
			expect(body).toContain('data-intent="replace"');
			expect(body).toContain('new.png');
			expect(body).toContain('Replacement selected');
			expect(body).toContain('image-attachment-control__placeholder');
			expect(create).not.toHaveBeenCalled();
		} finally { Object.defineProperty(globalThis, 'URL', { configurable: true, value: originalUrl }); }
	});

	test('renders remove only when a current image exists and normalizes malformed remove otherwise', () => {
		const remove = { intent: 'remove', file: null } as const;
		const current = render(ImageAttachmentControl, { props: { ...props(remove), currentImage: { src: '/old.jpg', alt: 'Old' } } }).body;
		expect(current).toContain('data-intent="remove"');
		expect(current).toContain('Image will be removed');
		expect(current).toContain('Cancel removal');
		expect(current).not.toContain('>Remove image</button>');
		const empty = render(ImageAttachmentControl, { props: props(remove) }).body;
		expect(empty).toContain('data-intent="keep"');
		expect(empty).toContain('No image selected');
	});

	test('preserves caller attributes, labels and disabled native attributes', () => {
		const { body } = render(ImageAttachmentControl, { props: {
			...props(), currentImage: { src: '/x.webp', alt: 'X' }, disabled: true,
			id: 'avatar', name: 'avatar-file', accept: '.webp', class: 'caller', style: 'width: 20rem'
		} });
		expect(body).toContain('class="image-attachment-control image-attachment-control--keep caller ');
		expect(body).toContain('style="width: 20rem"');
		expect(body).toContain('for="avatar"');
		expect(body).toContain('id="avatar"');
		expect(body).toContain('name="avatar-file"');
		expect(body).toContain('accept=".webp"');
		expect(body.match(/disabled/g)?.length).toBe(2);
	});

	test('does not validate, emit, or touch browser APIs while rendering', () => {
		const validator = vi.fn();
		const onvaluechange = vi.fn();
		const browserGetter = vi.fn(() => { throw new Error('SSR accessed window'); });
		Object.defineProperty(globalThis, 'window', { configurable: true, get: browserGetter });
		try {
			render(ImageAttachmentControl, { props: { ...props(), validator, onvaluechange } });
			expect(validator).not.toHaveBeenCalled();
			expect(onvaluechange).not.toHaveBeenCalled();
			expect(browserGetter).not.toHaveBeenCalled();
		} finally { Reflect.deleteProperty(globalThis, 'window'); }
	});
});
