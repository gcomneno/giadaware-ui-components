[English](field-description-error.md) | [Italiano](it/field-description-error.md)

# FieldDescription and FieldError

`FieldDescription` and `FieldError` are Studio primitives for supplementary
field text. They standardize presentation and an explicit validation-message
announcement policy without owning form controls, validation state or ARIA
associations.

Import them only from the Studio entry point:

```ts
import {
	FieldDescription,
	FieldError
} from 'giadaware-ui-components/studio';

import type {
	FieldDescriptionProps,
	FieldErrorProps
} from 'giadaware-ui-components/studio';
```

## Public contracts

`FieldDescriptionProps` contains:

- `text`: required consumer-resolved description text;
- `id`: optional consumer-owned ID;
- `class`: optional consumer class;
- `style`: optional inline style.

`FieldErrorProps` contains:

- `text`: required consumer-resolved validation text;
- `id`: optional consumer-owned ID;
- `announce`: optional explicit live-announcement request, defaulting to `false`;
- `class`: optional consumer class;
- `style`: optional inline style.

Both primitives render text only. They do not accept HTML or rich-content
snippets.

Whitespace-only `text` renders no node. A whitespace-only `id` is omitted.
For a non-blank `id`, Giada UI passes the consumer value through unchanged;
consumers remain responsible for supplying a valid HTML ID.

## FieldDescription

`FieldDescription` renders one static native paragraph:

```svelte
<FieldDescription
	id="email-description"
	text="Used for account notifications."
/>

<input
	id="email"
	aria-describedby="email-description"
/>
```

The paragraph has no live-region role or ARIA state. The consumer owns the
control, IDs and `aria-describedby` relationship.

## Static validation errors

`FieldError` is static by default:

```svelte
<input
	id="account-code"
	aria-invalid="true"
	aria-describedby="account-code-error"
/>

<FieldError
	id="account-code-error"
	text="Enter a valid account code."
/>
```

This mode intentionally adds no `role`, `aria-live` or `aria-atomic`. It is
appropriate for validation text already present during server rendering or
otherwise meant to be discovered through the field association rather than
announced as a newly occurring event.

Using `aria-describedby` for static validation text also avoids turning
hydration of an already-rendered server error into a repeated announcement.

## Description and static error together

Consumers may compose both IDs:

```svelte
<input
	id="display-name"
	aria-invalid="true"
	aria-describedby="display-name-description display-name-error"
/>

<FieldDescription
	id="display-name-description"
	text="Shown on your public profile."
/>

<FieldError
	id="display-name-error"
	text="Use at least three characters."
/>
```

Giada UI never constructs, merges or mutates these ARIA relationships.

## Dynamically introduced errors

When a consumer introduces a new error in response to an interaction, it may
explicitly request assertive announcement:

```svelte
<input
	id="dynamic-value"
	aria-invalid={error ? 'true' : undefined}
	aria-errormessage={error ? 'dynamic-value-error' : undefined}
/>

<FieldError
	id="dynamic-value-error"
	text={error}
	announce
/>
```

With `announce={true}`, a rendered `FieldError` uses:

- `role="alert"`;
- `aria-live="assertive"`;
- `aria-atomic="true"`.

The consumer still owns when the error exists, `aria-invalid`,
`aria-errormessage`, validation execution and focus policy.

`announce` is deliberately opt-in. `FieldError` does not infer whether text is
new, whether validation ran on the server or client, or whether announcing it
again would be appropriate.

## Relationship with FieldLabel

`FieldLabel` keeps its existing presentation-only responsibility. These
primitives do not alter it and do not create a monolithic field wrapper.

A complete field may therefore be composed from independent responsibilities:

```svelte
<label for="email">
	<FieldLabel
		label="Email"
		required
		requiredLabel="Required"
	/>
</label>

<input
	id="email"
	required
	aria-invalid={emailError ? 'true' : undefined}
	aria-describedby={
		emailError
			? 'email-description email-error'
			: 'email-description'
	}
/>

<FieldDescription
	id="email-description"
	text="Used for account notifications."
/>

<FieldError
	id="email-error"
	text={emailError}
/>
```

The consumer owns the semantic label association, native required state,
validation state and all IDs.

## Server and client validation

For errors already present in SSR output, keep `announce` false unless the
consumer has a specific reason to expose a live region.

For errors introduced after an interaction, `announce` may be enabled when
assertive announcement is appropriate.

The primitives do not implement:

- validation rules or schemas;
- touched or dirty state;
- SvelteKit actions;
- generated IDs;
- focus movement;
- automatic `aria-invalid`;
- automatic `aria-describedby`;
- automatic `aria-errormessage`;
- translation lookup.

## Styling

`FieldDescription` exposes:

- `--giu-field-description-color`;
- `--giu-field-description-size`;
- `--giu-field-description-line-height`.

`FieldError` exposes:

- `--giu-field-error-color`;
- `--giu-field-error-size`;
- `--giu-field-error-line-height`.

Every custom property has a neutral fallback. Styles are scoped and introduce
no application tokens, external assets, fonts or network dependencies.

Stable root classes are:

- `.giu-field-description`;
- `.giu-field-error`.

## Determinism and hydration

Equivalent props produce deterministic SSR output.

Hydration coverage verifies that static description, static error, controls and
consumer interaction nodes are reused with `recover: false`. Hydration does not
invent a live region. The opt-in alert appears only after the consumer actually
introduces the dynamic error.

## Responsibility boundary

Giada UI owns:

- the two presentation roots;
- omission of whitespace-only content;
- neutral styling hooks;
- the explicit static versus opt-in-live `FieldError` policy;
- deterministic SSR and hydration.

Consumers own:

- field and label elements;
- control IDs;
- description/error IDs;
- `aria-describedby`;
- `aria-errormessage`;
- `aria-invalid`;
- validation execution and state;
- server/client validation timing;
- focus policy;
- resolved copy and localization.
