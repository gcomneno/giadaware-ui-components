# ImageLightbox

`ImageLightbox` is a controlled Visitor primitive for presenting one full image
in a native modal dialog without cropping it.

## Import

```ts
import {
  ImageLightbox,
  type ImageLightboxLabels
} from 'giadaware-ui-components/visitor';
```

## Controlled usage

The consumer owns the trigger and the `open` state.

```svelte
<script lang="ts">
  import {
    ImageLightbox,
    type ImageLightboxLabels
  } from 'giadaware-ui-components/visitor';

  let open = $state(false);

  const labels = {
    dialog: 'Image preview',
    close: 'Close image'
  } satisfies ImageLightboxLabels;
</script>

<button type="button" onclick={() => open = true}>
  Enlarge image
</button>

{#snippet caption()}
  <span>Optional consumer-owned caption.</span>
{/snippet}

<ImageLightbox
  {open}
  onopenchange={(next) => open = next}
  src="/images/example.jpg"
  alt="Example landscape"
  {labels}
  {caption}
/>
```

## Public contract

`open`, `onopenchange`, `src`, `alt`, and `labels` are required.

`labels.dialog` names the modal dialog and `labels.close` is the visible close
control text. All translated or domain-facing copy remains consumer-owned.

`caption` is an optional Svelte snippet. `class` and `style` customize the
dialog root.

## Interaction model

The component uses the native HTML `dialog` element and `showModal()`.

The consumer owns the trigger. Opening the lightbox therefore follows ordinary
button or link semantics chosen by the consumer.

Closing can be requested by:

- the visible close button;
- `Escape`;
- clicking the dialog backdrop or the empty stage around the image.

Every close interaction calls `onopenchange(false)`. The consumer remains the
source of truth. If a consumer rejects the requested transition, the dialog
stays open.

The close button receives initial modal focus. Native dialog focus restoration
returns focus to the invoking trigger when the controlled state accepts close.

## Image behavior

The component displays one image. The image preserves its intrinsic aspect
ratio, uses `object-fit: contain`, and is constrained to the available viewport.

There are deliberately no `cover`, natural-size, gallery, previous/next,
counter, zoom, or routing behaviors in this primitive.

## Background scrolling

While a lightbox is open, Giada UI locks scrolling on both the document element
and body. Previous inline overflow values are restored exactly when the last
open `ImageLightbox` releases the lock.

Multiple instances therefore share a reference-counted document lock.

## Accessibility

Consumers must:

- use an accessible trigger;
- provide meaningful `labels.dialog` and `labels.close`;
- provide appropriate image alternative text;
- provide caption content only when it adds useful information.

Giada UI owns the native modal semantics, initial close-control focus, controlled
Escape handling, backdrop handling, and scroll restoration.

## Styling hooks

The stable root class is `giu-image-lightbox`.

Supported custom properties:

- `--giu-image-lightbox-color`
- `--giu-image-lightbox-background`
- `--giu-image-lightbox-backdrop`
- `--giu-image-lightbox-gap`
- `--giu-image-lightbox-padding`
- `--giu-image-lightbox-close-padding`
- `--giu-image-lightbox-close-border-width`
- `--giu-image-lightbox-close-border-color`
- `--giu-image-lightbox-close-radius`
- `--giu-image-lightbox-close-color`
- `--giu-image-lightbox-close-background`
- `--giu-image-lightbox-close-hover-background`
- `--giu-image-lightbox-focus-width`
- `--giu-image-lightbox-focus-color`
- `--giu-image-lightbox-focus-offset`
- `--giu-image-lightbox-caption-gap`
- `--giu-image-lightbox-caption-max-width`
- `--giu-image-lightbox-caption-color`

Internal descendant classes are not public DOM hooks.

## Non-goals

`ImageLightbox` does not own galleries, indexes, fit-mode selectors, application
routing, application i18n, persistence, or Nero Quotidiano domain models.
