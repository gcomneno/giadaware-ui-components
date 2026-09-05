import { render } from 'svelte/server';
import { describe, expect, test, vi } from 'vitest';

import { ImageFocalPointControl } from '../../src/lib/studio/index.js';

const image = {
	src: '/hero.jpg',
	alt: 'Hero image'
};

const baseProps = {
	image,
	onvaluechange: vi.fn(),
	label: 'Choose focal point'
};

describe('ImageFocalPointControl SSR', () => {
	test('renders deterministic centered markup for missing value', () => {
		const options = { props: baseProps };
		const first = render(ImageFocalPointControl, options);

		expect(first).toEqual(render(ImageFocalPointControl, options));
		expect(first.body).toContain('class="giu-image-focal-point-control');
		expect(first.body).toContain('data-giu-focal-x="0.5000"');
		expect(first.body).toContain('data-giu-focal-y="0.5000"');
		expect(first.body).toContain('src="/hero.jpg"');
		expect(first.body).toContain('alt="Hero image"');
		expect(first.body).toContain('aria-label="Choose focal point"');
		expect(first.body).toContain('style="left:50%;top:50%"');
	});

	test('renders normalized marker position from controlled value', () => {
		const { body } = render(ImageFocalPointControl, {
			props: {
				...baseProps,
				value: { x: 0.25, y: 0.75 }
			}
		});

		expect(body).toContain('data-giu-focal-x="0.2500"');
		expect(body).toContain('data-giu-focal-y="0.7500"');
		expect(body).toContain('style="left:25%;top:75%"');
	});

	test('safely normalizes malformed and out-of-range coordinates', () => {
		const malformed = render(ImageFocalPointControl, {
			props: {
				...baseProps,
				value: { x: Number.NaN, y: Number.POSITIVE_INFINITY } as never
			}
		}).body;
		expect(malformed).toContain('data-giu-focal-x="0.5000"');
		expect(malformed).toContain('data-giu-focal-y="0.5000"');

		const clamped = render(ImageFocalPointControl, {
			props: {
				...baseProps,
				value: { x: -10, y: 10 }
			}
		}).body;
		expect(clamped).toContain('data-giu-focal-x="0.0000"');
		expect(clamped).toContain('data-giu-focal-y="1.0000"');
	});

	test('preserves caller attributes and disabled native behavior', () => {
		const { body } = render(ImageFocalPointControl, {
			props: {
				...baseProps,
				value: null,
				disabled: true,
				id: 'hero-focal',
				class: 'caller',
				style: 'max-width: 12rem'
			}
		});

		expect(body).toContain('class="giu-image-focal-point-control caller');
		expect(body).toContain('style="max-width: 12rem"');
		expect(body).toContain('data-giu-disabled="true"');
		expect(body).toContain('id="hero-focal"');
		expect(body).toContain('disabled');
	});

	test('does not emit or touch browser APIs while rendering', () => {
		const onvaluechange = vi.fn();
		const browserGetter = vi.fn(() => { throw new Error('SSR accessed window'); });
		Object.defineProperty(globalThis, 'window', { configurable: true, get: browserGetter });
		try {
			render(ImageFocalPointControl, { props: { ...baseProps, onvaluechange } });
			expect(onvaluechange).not.toHaveBeenCalled();
			expect(browserGetter).not.toHaveBeenCalled();
		} finally { Reflect.deleteProperty(globalThis, 'window'); }
	});
});
