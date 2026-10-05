import { Radio } from '../../src/lib/studio/index.js';
import type { RadioProps, RadioValue } from '../../src/lib/studio/index.js';
import type { Component } from 'svelte';

type RadioBindings = typeof Radio extends Component<RadioProps, {}, infer Bindings>
	? Bindings
	: never;

const value: RadioValue = 'normal';

const nativeProps: RadioProps = {
	group: value,
	value,
	disabled: false,
	required: true,
	name: 'importance',
	form: 'editor',
	autofocus: true,
	'aria-label': 'Normal importance',
	'aria-describedby': 'importance-help',
	'data-testid': 'importance-normal',
	onclick: (event) => event.currentTarget.focus(),
	onchange: (event) => void event.currentTarget.checked,
	onkeydown: (event) => void event.key,
	class: 'consumer',
	style: '--giu-radio-size: 1.5rem'
};

const groupBinding: RadioBindings = 'group';

// @ts-expect-error Radio does not accept children
const unsupportedChildren: RadioProps = { children: {}, value: 'normal' };
// @ts-expect-error Radio fixes the native input type internally
const unsupportedType: RadioProps = { type: 'radio', value: 'normal' };
// @ts-expect-error checked is derived from bind:group and value
const unsupportedChecked: RadioProps = { checked: true, value: 'normal' };
// @ts-expect-error value is required
const missingValue: RadioProps = { name: 'importance' };
// @ts-expect-error group is the only public bindable component property
const unsupportedBinding: RadioBindings = 'value';

void [
	Radio,
	nativeProps,
	groupBinding,
	unsupportedChildren,
	unsupportedType,
	unsupportedChecked,
	missingValue,
	unsupportedBinding
];
