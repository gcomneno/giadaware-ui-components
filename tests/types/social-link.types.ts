import { SocialLink } from '../../src/lib/index.js';

import type {
	SocialIconId,
	SocialLinkProps
} from '../../src/lib/index.js';
import type { ComponentProps, Snippet } from 'svelte';

declare const children: Snippet;

const iconOnly: SocialLinkProps = {
	id: 'instagram',
	href: '/instagram',
	label: 'Instagram'
};

const labelled: SocialLinkProps = {
	id: 'github',
	href: '/github',
	children,
	target: '_blank',
	rel: 'me noreferrer',
	iconSize: 20,
	'aria-describedby': 'github-help',
	'data-analytics': 'social-github',
	onclick: (event) => void event.currentTarget.href,
	class: 'consumer-social-link',
	style: '--giu-social-link-gap: 0.75rem'
};

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2)
		? true
		: false;

type Expect<Value extends true> = Value;

type PublicPropsStaySynchronized = Expect<
	Equal<ComponentProps<typeof SocialLink>, SocialLinkProps>
>;

const componentProps: ComponentProps<typeof SocialLink> = labelled;
const id: SocialIconId = iconOnly.id;

// @ts-expect-error href is required.
const missingHref: SocialLinkProps = {
	id: 'github',
	label: 'GitHub'
};

// This shape is type-valid because the accessible-name condition depends on
// whether visible children are present. Runtime validation must fail closed.
const runtimeInvalidMissingName: SocialLinkProps = {
	id: 'github',
	href: '/github'
};

// Runtime validation also keeps visible children authoritative when a caller
// supplies both fields through an untyped boundary.
const runtimeDuplicateName: SocialLinkProps = {
	id: 'github',
	href: '/github',
	children,
	label: 'Ignored when visible content exists'
};

const ariaLabelUnsupported: SocialLinkProps = {
	id: 'github',
	href: '/github',
	label: 'GitHub',
	// @ts-expect-error aria-label is reserved by SocialLink.
	'aria-label': 'Override'
};

const ariaLabelledbyUnsupported: SocialLinkProps = {
	id: 'github',
	href: '/github',
	label: 'GitHub',
	// @ts-expect-error aria-labelledby is reserved by SocialLink.
	'aria-labelledby': 'other-name'
};

const invalidId: SocialLinkProps = {
	// @ts-expect-error Identifier registry remains closed.
	id: 'linkedin',
	href: '/linkedin',
	label: 'LinkedIn'
};

void (null as PublicPropsStaySynchronized | null);

void [
	SocialLink,
	iconOnly,
	labelled,
	componentProps,
	id,
	missingHref,
	runtimeInvalidMissingName,
	runtimeDuplicateName,
	ariaLabelUnsupported,
	ariaLabelledbyUnsupported,
	invalidId
];
