import { Checkbox } from '../../src/lib/index.js';
import type { CheckboxProps } from '../../src/lib/index.js';
import type { Component } from 'svelte';

type CheckboxBindings = typeof Checkbox extends Component<CheckboxProps, {}, infer Bindings>
	? Bindings
	: never;

const nativeProps: CheckboxProps = {
	checked: true,
	disabled: false,
	required: true,
	name: 'terms',
	value: 'accepted',
	form: 'editor',
	autofocus: true,
	'aria-label': 'Accept terms',
	'aria-describedby': 'terms-help',
	'data-testid': 'terms',
	onclick: (event) => event.currentTarget.focus(),
	onchange: (event) => void event.currentTarget.checked,
	onkeydown: (event) => void event.key,
	class: 'consumer',
	style: '--giu-checkbox-size: 1.5rem'
};

const uncheckedProps: CheckboxProps = {
	checked: false,
	name: 'newsletter',
	value: 'yes'
};

const checkedBinding: CheckboxBindings = 'checked';

// @ts-expect-error Checkbox does not accept children
const unsupportedChildren: CheckboxProps = { children: {} };
// @ts-expect-error Checkbox fixes the native input type internally
const unsupportedType: CheckboxProps = { type: 'checkbox' };
// @ts-expect-error checked is boolean-like, not a string
const invalidChecked: CheckboxProps = { checked: 'true' };
// @ts-expect-error checked is the only public bindable component property
const unsupportedBinding: CheckboxBindings = 'value';

void [Checkbox, nativeProps, uncheckedProps, checkedBinding, unsupportedChildren, unsupportedType, invalidChecked, unsupportedBinding];
