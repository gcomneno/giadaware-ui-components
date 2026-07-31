import { FormActions } from '../../src/lib/studio/index.js';
import type {
	FormActionsAlign,
	FormActionsProps
} from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const children: Snippet;

const alignments: FormActionsAlign[] = [
	'start',
	'center',
	'end',
	'space-between'
];
const minimalProps: FormActionsProps = { children };
const completeProps: FormActionsProps = {
	children,
	align: 'space-between',
	wrap: false,
	class: 'consumer-actions',
	style: '--giu-form-actions-gap: 1rem'
};

// @ts-expect-error children is required
const missingChildren: FormActionsProps = {};
// @ts-expect-error alignment is a closed union
const invalidAlign: FormActionsAlign = 'distributed';
// @ts-expect-error component props reject invalid alignment
const invalidAlignProps: FormActionsProps = { children, align: 'distributed' };
// @ts-expect-error wrap must be boolean
const invalidWrap: FormActionsProps = { children, wrap: 'yes' };
// @ts-expect-error arbitrary div attributes are not part of the public contract
const unsupportedRole: FormActionsProps = { children, role: 'group' };
// @ts-expect-error children must be a Svelte snippet
const invalidChildren: FormActionsProps = { children: 'Save' };
// @ts-expect-error normalization helper is internal to the Studio entry point
import { normalizeFormActionsAlign } from '../../src/lib/studio/index.js';

void [
	FormActions,
	alignments,
	minimalProps,
	completeProps,
	missingChildren,
	invalidAlign,
	invalidAlignProps,
	invalidWrap,
	unsupportedRole,
	invalidChildren,
	normalizeFormActionsAlign
];
