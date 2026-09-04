import { describe, expect, test } from 'vitest';

import {
	imageFocalPointFromClientPoint,
	moveImageFocalPointValue,
	normalizeImageFocalPointValue
} from '../../src/lib/studio/image-focal-point-control.js';

import type {
	ImageFocalPointImage,
	ImageFocalPointValue
} from '../../src/lib/studio/image-focal-point-control.js';

describe('ImageFocalPointControl value helpers', () => {
	test('normalizes missing and malformed values to center', () => {
		expect(normalizeImageFocalPointValue(null)).toEqual({ x: 0.5, y: 0.5 });
		expect(normalizeImageFocalPointValue(undefined)).toEqual({ x: 0.5, y: 0.5 });
		expect(normalizeImageFocalPointValue('center')).toEqual({ x: 0.5, y: 0.5 });
		expect(normalizeImageFocalPointValue({})).toEqual({ x: 0.5, y: 0.5 });
		expect(normalizeImageFocalPointValue({ x: Number.NaN, y: Number.POSITIVE_INFINITY })).toEqual({ x: 0.5, y: 0.5 });
	});

	test('preserves finite coordinates and clamps finite out-of-range values', () => {
		expect(normalizeImageFocalPointValue({ x: 0.25, y: 0.75 })).toEqual({ x: 0.25, y: 0.75 });
		expect(normalizeImageFocalPointValue({ x: -1, y: 2 })).toEqual({ x: 0, y: 1 });
		expect(normalizeImageFocalPointValue({ x: 1, y: 0 })).toEqual({ x: 1, y: 0 });
	});

	test('derives normalized coordinates from the supplied preview bounds', () => {
		expect(imageFocalPointFromClientPoint(60, 45, {
			left: 10,
			top: 20,
			width: 100,
			height: 50
		})).toEqual({ x: 0.5, y: 0.5 });
	});

	test('clamps coordinates derived outside preview bounds', () => {
		expect(imageFocalPointFromClientPoint(-10, 200, {
			left: 0,
			top: 0,
			width: 100,
			height: 100
		})).toEqual({ x: 0, y: 1 });
	});

	test('falls back to center for degenerate preview bounds', () => {
		expect(imageFocalPointFromClientPoint(10, 10, {
			left: 0,
			top: 0,
			width: 0,
			height: -1
		})).toEqual({ x: 0.5, y: 0.5 });
	});

	test('moves normalized values and clamps the result', () => {
		expect(moveImageFocalPointValue({ x: 0.5, y: 0.5 }, {
			x: 0.1,
			y: -0.01
		})).toEqual({ x: 0.6, y: 0.49 });
		expect(moveImageFocalPointValue({ x: 0.98, y: 0.02 }, {
			x: 0.1,
			y: -0.1
		})).toEqual({ x: 1, y: 0 });
	});

	test('does not mutate caller-owned values or image metadata', () => {
		const value: ImageFocalPointValue = { x: 0.25, y: 0.75 };
		const image: ImageFocalPointImage = {
			src: '/image.jpg',
			alt: 'Image'
		};
		const valueSnapshot = { ...value };
		const imageSnapshot = { ...image };

		normalizeImageFocalPointValue(value);
		moveImageFocalPointValue(value, { x: 0.1, y: 0.1 });
		imageFocalPointFromClientPoint(0, 0, {
			left: 0,
			top: 0,
			width: 100,
			height: 100
		});

		expect(value).toEqual(valueSnapshot);
		expect(image).toEqual(imageSnapshot);
	});
});
