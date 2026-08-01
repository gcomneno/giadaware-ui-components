# FieldLabel

`FieldLabel` is available only from `giadaware-ui-components/studio`. It
presents a field label row, resolved required or optional copy, and optional
hint text without creating the semantic association with a form control.

## Public contract

The exported `FieldLabelProps` contract contains:

- `label`: required visible label text;
- `hint`: optional resolved hint text;
- `required`: optional required-presentation flag;
- `optional`: optional optional-presentation flag;
- `requiredLabel`: consumer-resolved accessible expansion for the required
  marker;
- `optionalLabel`: consumer-resolved visible optional copy;
- `hintId`: optional ID applied to a rendered hint;
- `class`: optional consumer class applied to the label row;
- `style`: optional inline style applied to the label row.

All strings are rendered as text. `FieldLabel` does not accept unsafe HTML.

## Required and optional states

`required` takes precedence when both `required` and `optional` are true.

The visible required symbol is rendered only when `requiredLabel` contains
non-whitespace text. The symbol is hidden from assistive technology and the
consumer-provided expansion remains available to it. Omitting the marker is
safer than rendering an unexplained symbol.

Optional copy is rendered exactly as supplied. The component does not add
parentheses, punctuation or translated text. Empty or whitespace-only marker
labels are omitted.

These states are presentational. Consumers must apply native `required` to the
actual form control and keep conditional UI state aligned with server-side
validation.

## Parent label composition

```svelte
<script lang="ts">
	import { FieldLabel } from 'giadaware-ui-components/studio';
</script>

<label>
	<FieldLabel
		label="Display name"
		required
		requiredLabel="Required"
	/>
	<input name="displayName" required />
</label>
```

The parent `label` and native `required` attribute are consumer-owned.

## Explicit association and hint

```svelte
<label for="account-email">
	<FieldLabel
		label="Email"
		required
		requiredLabel="Required"
		hint="Used for account notifications."
		hintId="account-email-hint"
	/>
</label>

<input
	id="account-email"
	name="email"
	type="email"
	required
	aria-describedby="account-email-hint"
/>
```

`hintId` is applied only when a non-empty hint is rendered. The consumer owns
the control ID, `for` association and `aria-describedby` relationship.

## Conditional required state

```svelte
<FieldLabel
	label="Company registration number"
	required={isBusinessAccount}
	optional={!isBusinessAccount}
	requiredLabel="Required"
	optionalLabel="Optional"
/>

<input
	name="registrationNumber"
	required={isBusinessAccount}
/>
```

The same condition must drive presentation, native control semantics and server
validation.

## Relationship with form legends

Application-level text such as “All fields are required unless marked
optional” belongs to a form or fieldset legend. `FieldLabel` does not generate
form-level required or optional conventions, and it does not replace an
application-specific `StudioFormLegend`.

## Migration from Atelier-Kit

When replacing Atelier-Kit's local `StudioFieldLabel`:

1. resolve label, hint and marker strings in the consumer;
2. wrap or associate `FieldLabel` with the actual native control;
3. apply `required` to the control itself;
4. provide stable hint IDs and `aria-describedby` where needed;
5. keep application-specific legends and validation outside Giada UI.

## Styling

The supported custom properties are:

- `--giu-field-label-row-gap`;
- `--giu-field-label-color`;
- `--giu-field-label-weight`;
- `--giu-field-label-line-height`;
- `--giu-field-label-marker-size`;
- `--giu-field-label-marker-weight`;
- `--giu-field-label-required-color`;
- `--giu-field-label-optional-color`;
- `--giu-field-label-hint-gap`;
- `--giu-field-label-hint-color`;
- `--giu-field-label-hint-size`;
- `--giu-field-label-hint-line-height`.

Field layout, control spacing, error messages, validation state and form
structure remain consumer-owned.

## Determinism

For identical props, SSR output is deterministic. Hydration must reuse the
existing label-row, marker, hint and consumer-control nodes without adding
component-owned events or state.
