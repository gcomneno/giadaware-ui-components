[English](button.md) | [Italiano](it/button.md)

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

`ButtonVariant` is the closed union `primary | secondary | danger`. `ButtonSize` is `default | compact`. Both props normalize unknown untyped runtime values to `primary` and `default`. Visible `children` snippet content is required and remains responsible for the button's accessible name.

`leading` and `trailing` are optional presentation snippets around the main label. Their wrappers are `aria-hidden="true"`, so icons, spinners, badges, and other decorative indicators do not alter or duplicate the button's accessible name. These snippets must not contain interactive or focusable descendants.

`ButtonProps` builds on Svelte's public native `HTMLButtonAttributes` type. Applicable native button attributes and handlers—including `disabled`, `name`, `value`, `form`, `formaction`, `formmethod`, `formenctype`, `formnovalidate`, `formtarget`, `autofocus`, `aria-*`, `data-*`, and `onclick`—are forwarded to the native element. Explicit `type="submit"` and `type="reset"` retain their native form behavior.

Consumer classes compose with the component's `giu-button` classes. The standard inline `style` attribute is forwarded and can set ordinary declarations or supported custom properties.

## Leading and trailing content

The component owns only layout for the three regions: optional leading content, the required label, and optional trailing content. The leading and trailing regions do not shrink; the label may shrink and wrap inside narrow containers.

```svelte
{#snippet saveIcon()}
	<svg viewBox="0 0 16 16" width="16" height="16">
		<path d="M3 8h10" />
	</svg>
{/snippet}

<Button leading={saveIcon}>Save changes</Button>
```

A consumer-owned pending indicator can use the same presentation region while the consumer controls lifecycle semantics explicitly:

```svelte
<Button
	aria-busy={saving}
	trailing={saving ? pendingIndicator : undefined}
>
	Save changes
</Button>
```

`Button` does not set `aria-busy`, disable itself, announce status, or create a spinner. If a pending state needs an announcement, the consumer must provide that status outside the presentation-only leading/trailing regions.

## CSS custom properties

- Base colors: `--giu-button-color`, `--giu-button-background`, `--giu-button-border-color`.
- Hover colors: `--giu-button-hover-color`, `--giu-button-hover-background`, `--giu-button-hover-border-color`.
- Active colors: `--giu-button-active-color`, `--giu-button-active-background`, `--giu-button-active-border-color`.
- Shape and spacing: `--giu-button-border-width`, `--giu-button-border-radius`, `--giu-button-padding`, `--giu-button-compact-padding`, `--giu-button-content-gap`.
- Typography: `--giu-button-font-weight`.
- Focus indicator: `--giu-button-focus-width`, `--giu-button-focus-color`, `--giu-button-focus-offset`.
- Disabled presentation: `--giu-button-disabled-opacity`.

Every property is optional and has a neutral fallback. Styles are scoped and do not affect unrelated buttons.

## Responsibility boundary

`Button` presents one native control. It has no pending state, spinner, result, confirmation, live region, or asynchronous execution. Use `AsyncOperationPanel` to present a consumer-owned asynchronous lifecycle, placing `Button` in its action snippet when appropriate.

Leading and trailing snippets enrich text buttons only. Icon-only buttons remain a separate component with a distinct accessible-name and target-size contract. Links and action-group layout likewise remain separate concerns.
