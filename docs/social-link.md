# SocialLink

`SocialLink` is the root primitive for the recurring composition of a supported
`SocialIcon` with a native anchor.

Import it from the root entry point:

```ts
import {
	SocialLink
} from 'giadaware-ui-components';

import type {
	SocialLinkProps
} from 'giadaware-ui-components';
```

## Public contract

`SocialLink` always renders a native `<a>` when its runtime contract is valid.

The consumer provides:

- `id`, using the existing closed `SocialIconId` registry;
- an `href` containing at least one non-whitespace character;
- either a non-empty `label` for icon-only presentation or visible `children`;
- optional `iconSize`;
- applicable native anchor, ARIA, `data-*` and event attributes.

`href` and `id` are required by the public TypeScript contract.

The accessible-name rule depends on whether visible child content is present,
so `label` and `children` are individually optional in the structural public
type. Runtime validation enforces the actual invariant: an icon-only link with
no non-empty `label` renders no anchor. Development builds emit a diagnostic
once for each invalid condition.

`aria-label` and `aria-labelledby` are intentionally not part of
`SocialLinkProps`. Runtime callers that bypass the TypeScript contract cannot
override them: the component removes both from forwarded attributes.

## Icon-only presentation

Provide `label` when no visible child content is rendered:

```svelte
<SocialLink
	id="instagram"
	href="/instagram"
	label="Instagram profile"
/>
```

The component places the normalized label on the anchor with `aria-label`.

The nested `SocialIcon` is always decorative, so its SVG is hidden from the
accessibility tree and does not duplicate the anchor name.

A blank or missing icon-only label fails closed and renders no anchor.

`href` is checked for non-whitespace content but is otherwise rendered exactly
as supplied. `SocialLink` does not normalize or rewrite the consumer-owned URL.

## Icon plus visible label

Provide visible snippet content when the link has text:

```svelte
{#snippet githubLabel()}
	<span>GitHub profile</span>
{/snippet}

<SocialLink
	id="github"
	href="/github"
	children={githubLabel}
/>
```

In this mode the visible content supplies the accessible name. `SocialLink`
does not add `aria-label` or `aria-labelledby`, avoiding a duplicate naming
source.

If an untyped runtime caller supplies both visible children and `label`, the
visible content remains authoritative and `label` is ignored for naming.

## Navigation policy

The consumer owns navigation policy completely.

`SocialLink` does not automatically add or infer:

- `target`;
- `rel`;
- tracking parameters;
- analytics behavior;
- route handling;
- external-link announcements.

For example:

```svelte
<SocialLink
	id="github"
	href="https://github.com/example"
	label="GitHub profile"
	target="_blank"
	rel="me noreferrer"
/>
```

Those attributes are forwarded because the consumer supplied them. Without
them the component renders neither `target` nor `rel`.

The component is never a button and does not implement sharing, SDK calls,
tooltips or analytics.

## Native attribute forwarding

`SocialLinkProps` builds on Svelte's `HTMLAnchorAttributes`.

Applicable native anchor attributes and handlers compose with the component,
including `download`, `hreflang`, `media`, `ping`, `rel`, `target`, `type`,
`referrerpolicy`, ordinary ARIA attributes other than the reserved naming
attributes, `data-*` attributes and event handlers.

Consumer `class` and inline `style` values compose with the component root.

## Icon ownership

`SocialLink` reuses `SocialIcon`; it does not duplicate or maintain SVG
geometry.

The supported identifiers therefore remain exactly those exposed through
`SocialIconId` and `SOCIAL_ICON_IDS`.

`iconSize` is passed to `SocialIcon` as its `size` value. It defaults to
`24px` through the existing `SocialIcon` contract.

The existing `SocialIcon` API remains independently usable for decorative or
informative SVG presentation.

## Styling

The stable root class is:

```text
.giu-social-link
```

Two presentation classes distinguish the supported layouts:

```text
.giu-social-link--icon-only
.giu-social-link--labelled
```

The component exposes neutral CSS custom properties:

- `--giu-social-link-gap`;
- `--giu-social-link-border-radius`;
- `--giu-social-link-color`;
- `--giu-social-link-text-decoration`;
- `--giu-social-link-hover-color`;
- `--giu-social-link-hover-text-decoration`;
- `--giu-social-link-focus-width`;
- `--giu-social-link-focus-color`;
- `--giu-social-link-focus-offset`.

Every custom property has a fallback. Styling remains scoped to the component;
there are no hidden font, asset or network dependencies.

## Accessibility and hydration

The anchor keeps native link semantics, focus and keyboard activation.

The nested brand SVG is presentation-only relative to the link name.

SSR output is deterministic. Hydration coverage verifies that the existing
server anchor nodes are reused without mismatch, warning or error and remain
interactive after hydration.

Axe coverage verifies both icon-only and visible-label compositions.

## Third-party geometry and trademarks

`SocialLink` introduces no new icon geometry. It renders the existing
`SocialIcon` component and therefore inherits the same third-party geometry
provenance and trademark considerations.

See [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) and the
[`SocialIcon`](../README.md#socialicon) documentation for the complete notices.

## Responsibility boundary

`SocialLink` owns:

- one native anchor;
- composition with one supported decorative `SocialIcon`;
- the icon-only accessible-name requirement;
- avoiding duplicate accessible names with visible content;
- neutral presentation and focus styling;
- deterministic SSR and hydration.

Consumers own:

- destination URLs;
- `target` and `rel`;
- routing policy;
- visible copy and localization;
- analytics and tracking;
- external-link policy;
- application behavior.

`SocialLink` does not generate URLs, open social SDKs, act as a share control,
implement a tooltip or broaden the icon registry.
