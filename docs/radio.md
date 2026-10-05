[English](radio.md) | [Italiano](it/radio.md)

# Radio

`Radio` is available from `giadaware-ui-components`. It always
renders exactly one visible native `<input type="radio">`. The input remains
the interactive control; there is no wrapper, generated ID, proxy element,
component-owned label, `role="radio"` or `role="radiogroup"`.

```svelte
<script lang="ts">
	import { Radio } from 'giadaware-ui-components';

	let importance = $state('normal');
</script>

<label>
	<Radio bind:group={importance} name="importance" value="low" />
	Low
</label>

<label>
	<Radio bind:group={importance} name="importance" value="normal" />
	Normal
</label>
```

## Public contract

`RadioProps` builds on Svelte's public `HTMLInputAttributes` type. Native radio
attributes and handlers, including `disabled`, `required`, `name`, `form`,
`autofocus`, `aria-*`, `data-*`, `onchange`, `onclick`, `onkeydown`, consumer
`class` and consumer `style`, are forwarded to the input.

The component fixes `type="radio"` and rejects caller-controlled `type`.
`value` is required. The selected value is bindable through Svelte's standard
`bind:group` syntax.

`checked` is intentionally not part of the public contract. Svelte radio state
is represented by `bind:group`; the browser derives the checked state from the
group value and each radio's `value`.

## Native radio semantics

The element keeps the browser's native radio role, focus behavior, keyboard
interaction, same-name exclusivity and form participation.

Consumers own accessible labels and grouping semantics. Use native `<label>`,
`<fieldset>` and `<legend>` elements, or another valid accessible naming
strategy. The component generates no IDs and owns no group wrapper.

## Forms and groups

A selected radio contributes its `name`/`value` pair to native form submission.
For same-name radios, exactly one selected value is submitted.

`Radio` does not provide a `RadioGroup` abstraction. Consumers own group
composition, selected application state, validation messages, fieldsets,
legends and business meaning.

## CSS custom properties

The native input is styled directly with deterministic CSS geometry.

- Size: `--giu-radio-size`, `--giu-radio-dot-size`.
- Border: `--giu-radio-border-width`, `--giu-radio-border-color`.
- Base background: `--giu-radio-background`.
- Checked state: `--giu-radio-checked-color`,
  `--giu-radio-checked-border-color`.
- Hover: `--giu-radio-hover-border-color`.
- Focus indicator: `--giu-radio-focus-width`, `--giu-radio-focus-color`,
  `--giu-radio-focus-offset`.
- Disabled presentation: `--giu-radio-disabled-opacity`.

Every property is optional and has a neutral fallback. Styles are scoped and do
not affect unrelated inputs.

## Forced colors

In forced-colors/high-contrast modes, `Radio` uses system colors for the border,
selected dot, disabled state and focus outline.

## Provenance

The visual direction is adapted from the Uiverse source
`https://uiverse.io/risabbir/good-chicken-7` by risabbir, licensed MIT.

Decision: ADAPT.

Giada UI keeps the useful native-radio visual concept — circular border and
selected inner dot — while discarding the demo container, glassmorphism, glow,
orbit animation, positional color variants and `display: none` treatment of the
native input. The final primitive keeps the real radio visible and focusable.
