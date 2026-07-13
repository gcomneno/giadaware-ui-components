import { FormStatus } from '../../src/lib/index.js';

import type { FormStatusTone } from '../../src/lib/index.js';
import type { ComponentProps } from 'svelte';

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2)
		? true
		: false;

type Expect<Value extends true> = Value;

type FormStatusToneContract = Expect<
	Equal<
		FormStatusTone,
		'success' | 'error' | 'warning' | 'info'
	>
>;

const validProps: ComponentProps<typeof FormStatus> = {
	message: 'Saved',
	tone: 'success',
	durationMs: null,
	class: 'settings-status',
	style: '--giu-form-status-padding: 1rem'
};

const defaultedProps: ComponentProps<typeof FormStatus> = {
	message: 'Ready'
};

// @ts-expect-error FormStatusTone is a closed public union.
const invalidTone: FormStatusTone = 'neutral';

// @ts-expect-error FormStatus requires a message.
const missingMessage: ComponentProps<typeof FormStatus> = {
	tone: 'info'
};

void (null as FormStatusToneContract | null);
void validProps;
void defaultedProps;
void invalidTone;
void missingMessage;
