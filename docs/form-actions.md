[English](form-actions.md) | [Italiano](it/form-actions.md)

# FormActions

`FormActions` is available only from `giadaware-ui-components/studio`. It is a layout primitive for an arbitrary consumer-provided action snippet and always renders one native `div`.

```svelte
<script lang="ts">
	import { Button, FormActions } from 'giadaware-ui-components/studio';
</script>

<FormActions align="end">
	<Button type="submit">Save changes</Button>
	<Button variant="secondary">Cancel</Button>
</FormActions>
```

## Contract

`FormActionsProps` requires `children: Snippet`. It also accepts:

- `align?: 'start' | 'center' | 'end' | 'space-between'`, defaulting to `start`;
- `wrap?: boolean`, defaulting to `true`;
- optional consumer `class` and `style` values.

`align` controls main-axis alignment. It maps to `flex-start`, `center`, `flex-end`, or `space-between`. When content wraps, `space-between` operates independently on each flex line.

Wrapping is enabled by default. Setting `wrap={false}` selects `nowrap`; content may then overflow its container, and that is an explicit consumer choice.

## Ownership boundary

`FormActions` owns only horizontal flex layout, centered cross-axis alignment, box sizing and minimum-width safety, gap, wrapping, and main-axis alignment. It does not set margins, width, padding, borders, colors, typography, or descendant sizing. Margins and placement within a page or panel remain consumer-owned.

Children are rendered directly without individual wrappers or descendant styles. Buttons, links, inputs, forms, and other content retain their native semantics, attributes, focus order, keyboard behavior, event handlers, submission behavior, and navigation behavior. Accessible names and all other child semantics and behavior remain consumer-owned.

The component adds no role, ARIA attributes, live region, landmark, accessible-name mechanism, controls, events, focus management, or lifecycle behavior. It does not forward arbitrary native `div` attributes.

## Action order and toolbar boundary

Place the primary action first in DOM order by default, followed by secondary actions. A consumer may choose a different order when its workflow has a documented reason, but `FormActions` never changes the supplied order.

`FormActions` is not a toolbar. Interfaces that require toolbar semantics, grouping roles, roving focus, or arrow-key navigation need a separate component with an explicit accessibility contract.

## Styling

Consumer classes compose with `giu-form-actions`, and consumer inline styles are forwarded to the root `div`. The only public custom property is:

```css
--giu-form-actions-gap: 0.75rem;
```

The fallback is used when the property is not set. Alignment is selected through the `align` prop rather than a CSS custom property. Outer margin remains consumer-owned. Alignment and wrapping are implemented with scoped internal modifier classes, so the component does not inject library-owned `justify-content` or `flex-wrap` declarations into the consumer style.
