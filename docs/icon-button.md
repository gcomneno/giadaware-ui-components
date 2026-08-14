# IconButton

`IconButton` is available only from `giadaware-ui-components/studio`. It represents one icon-only native button with a required consumer-owned accessible name.

```svelte
<script lang="ts">
	import { IconButton } from 'giadaware-ui-components/studio';
</script>

{#snippet editIcon()}
	<svg viewBox="0 0 16 16" width="16" height="16">
		<path d="M2 12l2 2 9-9-2-2z" />
	</svg>
{/snippet}

<IconButton label="Edit item" icon={editIcon} />
```

## Public contract

`IconButtonProps` requires:

- `label: string`: consumer-resolved accessible name;
- `icon: Snippet`: visual icon geometry.

`variant` uses the existing `ButtonVariant` union `primary | secondary | danger`.
`size` uses the existing `ButtonSize` union `default | compact`.
Unknown untyped runtime variant and size values normalize through the same contract as `Button`.

`type` defaults to `button`. Consumers may explicitly use another valid native button type when required.

The required `label` is trimmed before use. A missing, non-string, empty, or whitespace-only runtime value fails closed: no unnamed button is rendered. Development builds emit one diagnostic warning; production builds do not warn.

`aria-label` and `aria-labelledby` are reserved by the component so they cannot replace the required `label` contract. Other applicable native attributes remain composable, including `disabled`, form attributes, `aria-describedby`, `aria-pressed`, `aria-expanded`, data attributes and event handlers.

## Decorative icon contract

The icon snippet is rendered inside an `aria-hidden="true"` wrapper. Its geometry therefore does not contribute to the button's accessible name.

The snippet must contain presentation only. It must not contain links, buttons, form controls or other focusable/interactive descendants.

Giada UI does not depend on an icon registry or icon library.

## Target size

The default control target is at least `2.75rem` (44px at the browser default root size). The compact target is at least `2.5rem` (40px).

Compact is a deliberate consumer choice and remains larger than the icon geometry itself.

## Guidance and tooltip boundary

`IconButton` does not implement a tooltip.

A consumer may provide ordinary native attributes such as `title` or associate visible explanatory text through `aria-describedby`, but neither mechanism replaces the required `label`.

## CSS custom properties

- Base colors: `--giu-icon-button-color`, `--giu-icon-button-background`, `--giu-icon-button-border-color`.
- Hover colors: `--giu-icon-button-hover-color`, `--giu-icon-button-hover-background`, `--giu-icon-button-hover-border-color`.
- Active colors: `--giu-icon-button-active-color`, `--giu-icon-button-active-background`, `--giu-icon-button-active-border-color`.
- Target and spacing: `--giu-icon-button-control-size`, `--giu-icon-button-compact-control-size`, `--giu-icon-button-padding`, `--giu-icon-button-compact-padding`.
- Shape: `--giu-icon-button-border-width`, `--giu-icon-button-border-radius`.
- Focus indicator: `--giu-icon-button-focus-width`, `--giu-icon-button-focus-color`, `--giu-icon-button-focus-offset`.
- Disabled presentation: `--giu-icon-button-disabled-opacity`.

Every property has a neutral fallback and remains scoped to `IconButton`.

## Responsibility boundary

`IconButton` owns one native icon-only button, its accessible-name requirement, decorative icon boundary, target size and neutral presentation.

It does not own:

- navigation or anchors;
- tooltips;
- toggle state beyond forwarded native ARIA;
- loading or asynchronous lifecycle;
- confirmation;
- icon selection or registry behavior;
- toolbar grouping or arrow-key navigation.

Use `Button` when visible text is part of the control. Its optional leading and trailing snippets enrich a text button; they do not replace the separate icon-only contract.
