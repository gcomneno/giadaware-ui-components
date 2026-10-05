[English](image-focal-point-control.md) | [Italiano](it/image-focal-point-control.md)

# ImageFocalPointControl

`ImageFocalPointControl` is a controlled primitive for choosing a focal
point on a source image that a consumer may later render in cropped media.

## Import

```ts
import {
  ImageFocalPointControl,
  type ImageFocalPointImage,
  type ImageFocalPointValue
} from 'giadaware-ui-components';
```

Import the explicit public stylesheet where the component is rendered:

```ts
import 'giadaware-ui-components/styles.css';
```

## Controlled Usage

```svelte
<script lang="ts">
  import {
    ImageFocalPointControl,
    type ImageFocalPointImage,
    type ImageFocalPointValue
  } from 'giadaware-ui-components';
  import 'giadaware-ui-components/styles.css';

  const image = {
    src: '/images/editorial-hero.jpg',
    alt: 'Editorial hero preview'
  } satisfies ImageFocalPointImage;

  let focalPoint: ImageFocalPointValue | null = $state(null);
</script>

<ImageFocalPointControl
  {image}
  value={focalPoint}
  onvaluechange={(next) => focalPoint = next}
  label="Choose hero image focal point"
/>
```

## Public Contract

The public value type is:

```ts
type ImageFocalPointValue = {
  x: number;
  y: number;
};
```

`x` and `y` are normalized coordinates in the inclusive `0..1` range. `x: 0`
is the left edge, `x: 1` is the right edge, `y: 0` is the top edge, and `y: 1`
is the bottom edge.

The public image type is:

```ts
type ImageFocalPointImage = {
  src: string;
  alt: string;
};
```

`image`, `onvaluechange` and `label` are required. `value` is optional and may
be `null`. Missing, `null`, malformed or non-finite coordinates render as the
center point `0.5, 0.5`. Finite coordinates outside the supported range are
clamped to `0..1`.

`disabled`, `id`, `class` and `style` are optional. `id` is applied to the
interactive focal-point surface. `class` and `style` compose with the root.

## Interaction Model

The control renders the source image and one visible focal marker.

Pointer, mouse, pen and touch interactions use pointer events. Pressing or
dragging on the preview requests a normalized value derived from the preview's
current bounding box. The component does not cache pixel dimensions, so dragging
continues to use the current rendered preview size if layout changes.

Keyboard interaction is available when the control has focus:

- Arrow keys adjust the current coordinate by `0.01`.
- `Shift` plus an Arrow key adjusts by `0.1`.
- All keyboard results are clamped to `0..1`.

Every meaningful transition calls `onvaluechange(next)`. The consumer remains
the source of truth. If the consumer rejects a requested transition, the marker
continues to render from the controlled `value`.

When `disabled` is true, the interactive surface is a disabled native button,
does not receive focus through normal keyboard navigation, and emits no
callbacks.

## Accessibility

The focal-point surface is a native button with the consumer-provided `label` as
its accessible name. The component does not use slider semantics because the web
platform has no accurate native or ARIA slider pattern for a single
two-dimensional point.

Consumers must provide:

- a meaningful `label` for the focal-point surface;
- appropriate `image.alt` text;
- any surrounding field label, description or validation relationships;
- all translated or domain-facing copy.

Giada UI owns focusability, disabled behavior and pointer/keyboard interaction
for the control itself.

## Styling Hooks

The stable root class is `giu-image-focal-point-control`.

Supported custom properties:

- `--giu-image-focal-point-preview-width`
- `--giu-image-focal-point-preview-aspect-ratio`
- `--giu-image-focal-point-preview-radius`
- `--giu-image-focal-point-preview-border`
- `--giu-image-focal-point-preview-background`
- `--giu-image-focal-point-object-fit`
- `--giu-image-focal-point-marker-size`
- `--giu-image-focal-point-marker-border`
- `--giu-image-focal-point-marker-background`
- `--giu-image-focal-point-marker-shadow`
- `--giu-image-focal-point-focus-width`
- `--giu-image-focal-point-focus-color`
- `--giu-image-focal-point-focus-offset`
- `--giu-image-focal-point-disabled-opacity`

Internal descendant classes are not public DOM hooks.

## Non-Responsibilities

`ImageFocalPointControl` does not persist coordinates, generate crops, mutate
the source image, upload files, detect faces or subjects, decide rendering
policy outside the control, map values to CSS `object-position`, own consumer
schemas, own routes, or encode application/domain logic.
