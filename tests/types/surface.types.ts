import { Surface } from '../../src/lib/studio/index.js';
import type { SurfaceProps } from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const children: Snippet;

const minimalProps: SurfaceProps = {
	children,
};

const completeProps: SurfaceProps = {
	children,
	class: 'consumer-surface',
	style: '--giu-surface-padding: 2rem',
};

// @ts-expect-error children are required
const missingChildren: SurfaceProps = {};
const unsupportedRole: SurfaceProps = {
	children,
	// @ts-expect-error arbitrary div attributes are not public
	role: 'region',
};
const unsupportedLabel: SurfaceProps = {
	children,
	// @ts-expect-error Surface does not own accessible naming
	'aria-label': 'Settings',
};
const invalidChildren: SurfaceProps = {
	// @ts-expect-error children must be a Svelte snippet
	children: 'Surface content',
};

void [
	Surface,
	minimalProps,
	completeProps,
	missingChildren,
	unsupportedRole,
	unsupportedLabel,
	invalidChildren,
];
