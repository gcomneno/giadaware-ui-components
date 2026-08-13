import { render } from 'svelte/server';
import { expect, test } from 'vitest';
import ImageLightboxHydrationProbe from '../fixtures/ImageLightboxHydrationProbe.svelte';
import {
	IMAGE_LIGHTBOX_HYDRATION_SSR_BODY
} from '../fixtures/image-lightbox-hydration-contract.js';

test('produces deterministic ImageLightbox hydration markup', () => {
	const first = render(ImageLightboxHydrationProbe);

	expect(first).toEqual(render(ImageLightboxHydrationProbe));
	expect(first.body).toBe(IMAGE_LIGHTBOX_HYDRATION_SSR_BODY);
	expect(first.body).toContain('<dialog');
	expect(first.body).toContain('aria-label="Hydration image preview"');
	expect(first.body).toContain('giu-image-lightbox__actions');
	expect(first.body).toContain('Hydration action');

	const figureEnd = first.body.indexOf('</figure>');
	const actionsStart = first.body.indexOf('giu-image-lightbox__actions');

	expect(figureEnd).toBeGreaterThan(-1);
	expect(actionsStart).toBeGreaterThan(figureEnd);
	expect(first.body).not.toMatch(/<dialog[^>]*\sopen(?:=|\s|>)/);
});

test('keeps initially-open SSR markup deterministic without manufacturing an open attribute', async () => {
	const { default: InitiallyOpenProbe } = await import(
		'../fixtures/ImageLightboxInitiallyOpenHydrationProbe.svelte'
	);
	const expected = IMAGE_LIGHTBOX_HYDRATION_SSR_BODY.replace(
		'data-open="false"',
		'data-open="true"'
	);
	const body = render(InitiallyOpenProbe).body;

	expect(body).toBe(expected);
	expect(body).not.toMatch(/<dialog[^>]*\sopen(?:=|\s|>)/);
});
