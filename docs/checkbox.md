[English](checkbox.md) | [Italiano](it/checkbox.md)

# Checkbox

`Checkbox` is available only from `giadaware-ui-components/studio`. It always
renders exactly one visible native `<input type="checkbox">`. The input remains
the interactive control; there is no wrapper, generated ID, proxy element,
component-owned label, `role="checkbox"` or `role="switch"`.

```svelte
<script lang="ts">
	import { Checkbox } from 'giadaware-ui-components/studio';

	let featured = $state(false);
</script>

<label>
	<Checkbox bind:checked={featured} name="featured" value="yes" />
	Featured item
</label>
```

## Public contract

`CheckboxProps` builds on Svelte's public `HTMLInputAttributes` type. Native
checkbox attributes and handlers, including `disabled`, `required`, `name`,
`value`, `form`, `autofocus`, `aria-*`, `data-*`, `onchange`, `onclick`,
`onkeydown`, consumer `class` and consumer `style`, are forwarded to the input.

The component fixes `type="checkbox"` and rejects caller-controlled `type`.
`checked` is bindable with Svelte's standard `bind:checked` syntax:

```svelte
<Checkbox bind:checked={accepted} required name="terms" value="accepted" />
```

Do not pass a synthetic `bind:checked` prop. Use the Svelte binding syntax.

## Native checkbox semantics

The element keeps the browser's checkbox role, activation behavior and form
behavior. Pointer activation and Space-key activation toggle the checked state
unless the input is disabled. Disabled checkboxes keep native disabled behavior
and receive a distinct visual presentation.

Consumers own the accessible label. Wrap the checkbox in a native `<label>`,
connect a separate label with `for`/`id`, or provide another valid accessible
name through native attributes when appropriate. The component does not generate
IDs because stable relationships belong to the consumer.

## Forms and groups

Native form submission is preserved. A checked checkbox contributes its
`name`/`value` pair to `FormData`; an unchecked checkbox contributes no entry.
When multiple checkboxes use the same `name`, the browser submits one entry for
each checked control:

```svelte
<fieldset>
	<legend>Topics</legend>
	<label><Checkbox name="topics" value="design" /> Design</label>
	<label><Checkbox name="topics" value="accessibility" /> Accessibility</label>
</fieldset>
```

The component does not provide a checkbox-group abstraction, validation
abstraction or indeterminate abstraction. Consumers own fieldsets, legends,
validation copy, error associations and any collection state.

## Checkbox, not Switch

Use `Checkbox` when the control represents native checkbox semantics: selecting
one or more values, accepting an option, or submitting a checked value with a
form. Do not restyle it into a switch or add `role="switch"`. A switch is a
separate semantic pattern and is intentionally outside this primitive.

## CSS custom properties

The native input is styled directly. Its checkmark is deterministic CSS
geometry, not a font glyph.

- Size and shape: `--giu-checkbox-size`, `--giu-checkbox-border-width`,
  `--giu-checkbox-border-radius`.
- Base colors: `--giu-checkbox-color`, `--giu-checkbox-background`,
  `--giu-checkbox-border-color`.
- Checked colors: `--giu-checkbox-checked-color`,
  `--giu-checkbox-checked-background`,
  `--giu-checkbox-checked-border-color`.
- Hover colors: `--giu-checkbox-hover-background`,
  `--giu-checkbox-hover-border-color`.
- Focus indicator: `--giu-checkbox-focus-width`,
  `--giu-checkbox-focus-color`, `--giu-checkbox-focus-offset`.
- Disabled presentation: `--giu-checkbox-disabled-opacity`.

Every property is optional and has a neutral fallback. Styles are scoped and do
not affect unrelated inputs.

## Forced colors

In forced-colors/high-contrast modes, the checkbox uses system colors for its
border, fill, checkmark and focus outline so the native state remains visible.

## Provenance

The visual approach is adapted from the Uiverse source
`https://uiverse.io/cbolson/calm-wasp-75` by cbolson / Chris Bolson, licensed
MIT. Decision: ADAPT. Giada UI keeps only the useful direction of styling a
native checkbox directly with `appearance: none` and scoped CSS states. It does
not copy the demo form, wrapper, content, names or colors.
