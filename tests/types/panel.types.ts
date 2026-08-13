import { Panel } from '../../src/lib/studio/index.js';
import type {
	PanelHeadingLevel,
	PanelProps,
} from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const children: Snippet;
declare const description: Snippet;
declare const actions: Snippet;
declare const footer: Snippet;

const headingLevels: PanelHeadingLevel[] = [2, 3, 4, 5, 6];

const minimalProps: PanelProps = {
	title: 'Panel title',
	children,
};

const completeProps: PanelProps = {
	title: 'Panel title',
	description,
	actions,
	footer,
	children,
	headingLevel: 4,
	id: 'settings-panel',
	class: 'consumer-panel',
	style: '--giu-panel-gap: 1.5rem',
};

// @ts-expect-error title is required
const missingTitle: PanelProps = { children };
// @ts-expect-error children are required
const missingChildren: PanelProps = { title: 'Panel title' };
// @ts-expect-error heading levels start at 2
const invalidHeadingLevel: PanelHeadingLevel = 1;
const invalidHeadingProps: PanelProps = {
	title: 'Panel title',
	children,
	// @ts-expect-error component props reject invalid heading levels
	headingLevel: 1,
};
const unsupportedRole: PanelProps = {
	title: 'Panel title',
	children,
	// @ts-expect-error arbitrary section attributes are not public
	role: 'region',
};
const invalidChildren: PanelProps = {
	title: 'Panel title',
	// @ts-expect-error children must be a Svelte snippet
	children: 'Panel body',
};
// @ts-expect-error normalization helper is internal to the Studio entry point
import { normalizePanelHeadingLevel } from '../../src/lib/studio/index.js';

void [
	Panel,
	headingLevels,
	minimalProps,
	completeProps,
	missingTitle,
	missingChildren,
	invalidHeadingLevel,
	invalidHeadingProps,
	unsupportedRole,
	invalidChildren,
	normalizePanelHeadingLevel,
];
