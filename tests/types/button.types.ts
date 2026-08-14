import { Button } from '../../src/lib/studio/index.js';
import type { ButtonProps, ButtonSize, ButtonVariant } from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const children: Snippet;
declare const leading: Snippet;
declare const trailing: Snippet;

const variants: ButtonVariant[] = ['primary', 'secondary', 'danger'];
const sizes: ButtonSize[] = ['default', 'compact'];
const nativeProps: ButtonProps = {
	children,
	leading,
	trailing,
	type: 'submit',
	disabled: false,
	name: 'intent',
	value: 'save',
	form: 'editor',
	formaction: '/save',
	formmethod: 'post',
	formenctype: 'multipart/form-data',
	formnovalidate: true,
	formtarget: '_self',
	autofocus: true,
	'aria-label': 'Save document',
	'data-testid': 'save',
	onclick: (event) => event.currentTarget.focus(),
	onkeydown: (event) => void event.key,
	class: 'consumer',
	style: '--giu-button-background: navy'
};

// @ts-expect-error children is required
const missingChildren: ButtonProps = { type: 'button' };
// @ts-expect-error leading and trailing do not replace required children
const missingChildrenWithRegions: ButtonProps = { leading, trailing };
// @ts-expect-error variant is closed
const invalidVariant: ButtonVariant = 'quiet';
// @ts-expect-error size is closed
const invalidSize: ButtonSize = 'large';
// @ts-expect-error component rejects invalid variants
const invalidVariantProps: ButtonProps = { children, variant: 'quiet' };
// @ts-expect-error component rejects invalid sizes
const invalidSizeProps: ButtonProps = { children, size: 'large' };
// @ts-expect-error native button type remains closed
const invalidType: ButtonProps = { children, type: 'link' };

void [Button, variants, sizes, nativeProps, missingChildren, missingChildrenWithRegions, invalidVariant, invalidSize, invalidVariantProps, invalidSizeProps, invalidType];
