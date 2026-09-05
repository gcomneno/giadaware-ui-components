import { ImageFocalPointControl } from '../../src/lib/studio/index.js';
import type {
	ImageFocalPointControlProps,
	ImageFocalPointImage,
	ImageFocalPointValue
} from '../../src/lib/studio/index.js';
import type { ComponentProps } from 'svelte';

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2) ? true : false;
type Expect<Value extends true> = Value;
type ValueContract = Expect<Equal<ImageFocalPointValue, { x: number; y: number }>>;
type ImageContract = Expect<Equal<ImageFocalPointImage, { src: string; alt: string }>>;

const image: ImageFocalPointImage = {
	src: '/image.jpg',
	alt: 'Image preview'
};
const value: ImageFocalPointValue = {
	x: 0.25,
	y: 0.75
};
const requiredProps: ComponentProps<typeof ImageFocalPointControl> = {
	image,
	onvaluechange: (next: ImageFocalPointValue) => { void next; },
	label: 'Choose focal point'
};
const completeProps: ImageFocalPointControlProps = {
	...requiredProps,
	value,
	disabled: false,
	id: 'image-focal',
	class: 'focal-point',
	style: 'max-width: 12rem'
};
const nullValueProps: ImageFocalPointControlProps = {
	...requiredProps,
	value: null
};
const omittedValueProps: ImageFocalPointControlProps = requiredProps;

// @ts-expect-error Image source metadata is required.
const missingImageSrc: ImageFocalPointImage = { alt: 'Image preview' };
// @ts-expect-error Image alternative text is required.
const missingImageAlt: ImageFocalPointImage = { src: '/image.jpg' };
// @ts-expect-error Value requires x.
const missingX: ImageFocalPointValue = { y: 0.5 };
// @ts-expect-error Value requires y.
const missingY: ImageFocalPointValue = { x: 0.5 };
// @ts-expect-error Required component props are missing.
const missingRequiredProps: ComponentProps<typeof ImageFocalPointControl> = { image };
const wrongCallbackProps: ImageFocalPointControlProps = {
	...requiredProps,
	// @ts-expect-error Callback receives normalized coordinates.
	onvaluechange: (next: string) => { void next; }
};
// @ts-expect-error Consumer-facing label is required.
const missingLabel: ImageFocalPointControlProps = {
	image,
	onvaluechange: (_next: ImageFocalPointValue) => {}
};

// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { normalizeImageFocalPointValue } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { imageFocalPointFromClientPoint } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { moveImageFocalPointValue } from '../../src/lib/studio/index.js';
// @ts-expect-error ImageFocalPointControl is Studio-only.
import { ImageFocalPointControl as RootImageFocalPointControl } from '../../src/lib/index.js';
// @ts-expect-error ImageFocalPointControl is Studio-only.
import { ImageFocalPointControl as VisitorImageFocalPointControl } from '../../src/lib/visitor/index.js';

void (null as unknown as ValueContract);
void (null as unknown as ImageContract);
void completeProps;
void nullValueProps;
void omittedValueProps;
void missingImageSrc;
void missingImageAlt;
void missingX;
void missingY;
void missingRequiredProps;
void wrongCallbackProps;
void missingLabel;
void normalizeImageFocalPointValue;
void imageFocalPointFromClientPoint;
void moveImageFocalPointValue;
void RootImageFocalPointControl;
void VisitorImageFocalPointControl;
