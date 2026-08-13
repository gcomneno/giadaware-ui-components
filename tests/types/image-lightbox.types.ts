import type { Snippet } from 'svelte';
import { ImageLightbox } from '../../src/lib/visitor/index.js';
import type {
	ImageLightboxLabels,
	ImageLightboxProps
} from '../../src/lib/visitor/index.js';

const labels: ImageLightboxLabels = {
	dialog: 'Preview',
	close: 'Close'
};

declare const actions: Snippet;

const props: ImageLightboxProps = {
	open: false,
	onopenchange: (open) => open,
	src: '/image.jpg',
	alt: 'Example',
	labels,
	actions,
	class: 'consumer',
	style: 'background:black'
};

// @ts-expect-error labels are required
const missingLabels: ImageLightboxProps = {
	open: false,
	onopenchange: () => {},
	src: '/image.jpg',
	alt: 'Example'
};

// @ts-expect-error onopenchange is required
const missingOpenChange: ImageLightboxProps = {
	open: false,
	src: '/image.jpg',
	alt: 'Example',
	labels
};

const invalidCallback: ImageLightboxProps = {
	open: false,
	// @ts-expect-error callback receives a boolean
	onopenchange: (open: string) => open,
	src: '/image.jpg',
	alt: 'Example',
	labels
};

void [
	ImageLightbox,
	labels,
	props,
	missingLabels,
	missingOpenChange,
	invalidCallback
];
