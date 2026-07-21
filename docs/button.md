# Button

`Button` is available only from `giadaware-ui-components/studio`. It always renders a native `button`, preserves native focus, keyboard, click, form, and disabled behavior, and defaults to `type="button"` to avoid accidental form submission.

```svelte
<script lang="ts">
	import { Button } from 'giadaware-ui-components/studio';
</script>

<Button>Save changes</Button>
<Button type="submit">Submit form</Button>
<Button disabled>Unavailable</Button>
<Button variant="danger">Remove item</Button>
<Button variant="secondary" size="compact">Move up</Button>
```

## Public contract

`ButtonVariant` is the closed union `primary | secondary | danger`. `ButtonSize` is `default | compact`. Both props normalize unknown untyped runtime values to `primary` and `default`. Visible `children` snippet content is required and is responsible for the button's accessible name.

`ButtonProps` builds on Svelte's public native `HTMLButtonAttributes` type. Applicable native button attributes and handlers—including `disabled`, `name`, `value`, `form`, `formaction`, `formmethod`, `formenctype`, `formnovalidate`, `formtarget`, `autofocus`, `aria-*`, `data-*`, and `onclick`—are forwarded to the native element. Explicit `type="submit"` and `type="reset"` retain their native form behavior.

Consumer classes compose with the component's `giu-button` classes. The standard inline `style` attribute is forwarded and can set ordinary declarations or supported custom properties.

## CSS custom properties

- Base colors: `--giu-button-color`, `--giu-button-background`, `--giu-button-border-color`.
- Hover colors: `--giu-button-hover-color`, `--giu-button-hover-background`, `--giu-button-hover-border-color`.
- Active colors: `--giu-button-active-color`, `--giu-button-active-background`, `--giu-button-active-border-color`.
- Shape and spacing: `--giu-button-border-width`, `--giu-button-border-radius`, `--giu-button-padding`, `--giu-button-compact-padding`.
- Typography: `--giu-button-font-weight`.
- Focus indicator: `--giu-button-focus-width`, `--giu-button-focus-color`, `--giu-button-focus-offset`.
- Disabled presentation: `--giu-button-disabled-opacity`.

Every property is optional and has a neutral fallback. Styles are scoped and do not affect unrelated buttons.

## Responsibility boundary

`Button` presents one native control. It has no pending state, spinner, result, confirmation, live region, or asynchronous execution. Use `AsyncOperationPanel` to present a consumer-owned asynchronous lifecycle, placing `Button` in its action snippet when appropriate.

Links, icon-only buttons, and action-group layout require separate future components with their own semantic and accessibility contracts.
