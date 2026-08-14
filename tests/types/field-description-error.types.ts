import {
	FieldDescription,
	FieldError
} from '../../src/lib/studio/index.js';

import type {
	FieldDescriptionProps,
	FieldErrorProps
} from '../../src/lib/studio/index.js';
import type { ComponentProps } from 'svelte';

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2)
		? true
		: false;

type Expect<Value extends true> = Value;

type FieldDescriptionPropsStaySynchronized = Expect<
	Equal<
		ComponentProps<typeof FieldDescription>,
		FieldDescriptionProps
	>
>;

type FieldErrorPropsStaySynchronized = Expect<
	Equal<
		ComponentProps<typeof FieldError>,
		FieldErrorProps
	>
>;

const description: FieldDescriptionProps = {
	text: 'Used for account notifications.',
	id: 'email-description',
	class: 'consumer-description',
	style: '--giu-field-description-color: #505050'
};

const staticError: FieldErrorProps = {
	text: 'Enter a valid email address.',
	id: 'email-error',
	class: 'consumer-error',
	style: '--giu-field-error-color: #9f1d1d'
};

const announcedError: FieldErrorProps = {
	text: 'This value is required.',
	id: 'required-error',
	announce: true
};

// @ts-expect-error text is required.
const missingDescriptionText: FieldDescriptionProps = {
	id: 'missing-description'
};

// @ts-expect-error text is required.
const missingErrorText: FieldErrorProps = {
	id: 'missing-error'
};

void (null as FieldDescriptionPropsStaySynchronized | null);
void (null as FieldErrorPropsStaySynchronized | null);

void [
	FieldDescription,
	FieldError,
	description,
	staticError,
	announcedError,
	missingDescriptionText,
	missingErrorText
];
