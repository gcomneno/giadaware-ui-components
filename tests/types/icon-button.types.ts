import { IconButton } from '../../src/lib/studio/index.js';
import type {
	ButtonSize,
	ButtonVariant,
	IconButtonProps
} from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const icon: Snippet;

const variants: ButtonVariant[] = ['primary', 'secondary', 'danger'];
const sizes: ButtonSize[] = ['default', 'compact'];

const nativeProps: IconButtonProps = {
	label: 'Edit item',
	icon,
	type: 'button',
	disabled: false,
	name: 'intent',
	value: 'edit',
	form: 'editor',
	autofocus: true,
	'aria-describedby': 'edit-help',
	'aria-pressed': false,
	'data-testid': 'edit',
	onclick: (event) => event.currentTarget.focus(),
	onkeydown: (event) => void event.key,
	class: 'consumer',
	style: '--giu-icon-button-background: navy'
};

// @ts-expect-error label is required
const missingLabel: IconButtonProps = { icon };
// @ts-expect-error icon is required
const missingIcon: IconButtonProps = { label: 'Edit item' };
// @ts-expect-error children are not part of the icon-only contract
const childrenUnsupported: IconButtonProps = { label: 'Edit item', icon, children: icon };
// @ts-expect-error aria-label is reserved for the required label prop
const ariaLabelUnsupported: IconButtonProps = { label: 'Edit item', icon, 'aria-label': 'Override' };
// @ts-expect-error aria-labelledby would override the required label contract
const ariaLabelledbyUnsupported: IconButtonProps = { label: 'Edit item', icon, 'aria-labelledby': 'other-name' };
// @ts-expect-error variant is closed
const invalidVariant: IconButtonProps = { label: 'Edit item', icon, variant: 'quiet' };
// @ts-expect-error size is closed
const invalidSize: IconButtonProps = { label: 'Edit item', icon, size: 'large' };
// @ts-expect-error native button type remains closed
const invalidType: IconButtonProps = { label: 'Edit item', icon, type: 'link' };

void [
	IconButton,
	variants,
	sizes,
	nativeProps,
	missingLabel,
	missingIcon,
	childrenUnsupported,
	ariaLabelUnsupported,
	ariaLabelledbyUnsupported,
	invalidVariant,
	invalidSize,
	invalidType
];
