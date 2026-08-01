import { FieldLabel } from '../../src/lib/studio/index.js';
import type { FieldLabelProps } from '../../src/lib/studio/index.js';

const minimalProps: FieldLabelProps = {
	label: 'Display name',
};

const completeProps: FieldLabelProps = {
	label: 'Display name',
	hint: 'Shown on your public profile.',
	required: true,
	optional: false,
	requiredLabel: 'Required',
	optionalLabel: 'Optional',
	hintId: 'display-name-hint',
	class: 'consumer-field-label',
	style: '--giu-field-label-row-gap: 0.5rem',
};

// @ts-expect-error label is required
const missingLabel: FieldLabelProps = {};
const invalidRequired: FieldLabelProps = {
	label: 'Display name',
	// @ts-expect-error required must be boolean
	required: 'yes',
};
const invalidHintId: FieldLabelProps = {
	label: 'Display name',
	// @ts-expect-error hintId must be a string
	hintId: 42,
};
const unsupportedRole: FieldLabelProps = {
	label: 'Display name',
	// @ts-expect-error arbitrary span attributes are not public
	role: 'group',
};
const unsupportedFor: FieldLabelProps = {
	label: 'Display name',
	// @ts-expect-error FieldLabel does not own control association
	for: 'display-name',
};

void [
	FieldLabel,
	minimalProps,
	completeProps,
	missingLabel,
	invalidRequired,
	invalidHintId,
	unsupportedRole,
	unsupportedFor,
];
