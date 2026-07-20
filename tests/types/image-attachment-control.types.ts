import { ImageAttachmentControl } from '../../src/lib/studio/index.js';
import type {
	ImageAttachmentControlLabels,
	ImageAttachmentCurrentImage,
	ImageAttachmentFileValidator,
	ImageAttachmentIntent,
	ImageAttachmentState,
	ImageAttachmentValidationError
} from '../../src/lib/studio/index.js';
import type { ComponentProps } from 'svelte';

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2) ? true : false;
type Expect<Value extends true> = Value;
type IntentContract = Expect<Equal<ImageAttachmentIntent, 'keep' | 'replace' | 'remove'>>;

const file = new File(['image'], 'image.png', { type: 'image/png' });
const keep: ImageAttachmentState = { intent: 'keep', file: null };
const replace: ImageAttachmentState = { intent: 'replace', file };
const remove: ImageAttachmentState = { intent: 'remove', file: null };
const currentImage: ImageAttachmentCurrentImage = {
	src: '/image.png',
	alt: 'Current image',
	name: 'image.png'
};
const labels: ImageAttachmentControlLabels = {
	input: 'Choose image',
	cancelReplacement: 'Cancel replacement',
	remove: 'Remove image',
	cancelRemoval: 'Cancel removal',
	keepExistingStatus: 'Existing image kept',
	keepEmptyStatus: 'No image selected',
	replaceStatus: 'Replacement selected',
	removeStatus: 'Image will be removed',
	replacementPreviewAlt: 'Replacement preview'
};
const validator: ImageAttachmentFileValidator = (candidate: File) =>
	candidate.size === 0 ? { code: 'custom', message: 'Empty image' } : null;
const errors: ImageAttachmentValidationError[] = [
	{ code: 'invalid-type', message: 'Wrong type' },
	{ code: 'too-large', message: 'Too large' },
	{ code: 'custom', message: 'Custom error' }
];
const requiredProps: ComponentProps<typeof ImageAttachmentControl> = {
	value: keep,
	onvaluechange: (state: ImageAttachmentState) => { void state; },
	invalidTypeMessage: 'Wrong type',
	tooLargeMessage: 'Too large',
	labels
};
const completeProps: ComponentProps<typeof ImageAttachmentControl> = {
	...requiredProps,
	currentImage,
	disabled: false,
	accept: 'image/*',
	maxSizeBytes: 1_000_000,
	validator,
	name: 'image',
	id: 'image-input',
	class: 'attachment',
	style: 'max-width: 20rem'
};

// @ts-expect-error ImageAttachmentIntent is closed.
const invalidIntent: ImageAttachmentIntent = 'archive';
// @ts-expect-error Replace requires a native File.
const replaceWithNull: ImageAttachmentState = { intent: 'replace', file: null };
// @ts-expect-error Keep requires file to be null.
const keepWithFile: ImageAttachmentState = { intent: 'keep', file };
// @ts-expect-error Remove requires file to be null.
const removeWithFile: ImageAttachmentState = { intent: 'remove', file };
// @ts-expect-error Validation error codes are closed.
const invalidError: ImageAttachmentValidationError = { code: 'unknown', message: 'Unknown' };
// @ts-expect-error Required component props are missing.
const missingRequiredProps: ComponentProps<typeof ImageAttachmentControl> = { value: keep };
// @ts-expect-error Every caller-owned label is required.
const incompleteLabels: ImageAttachmentControlLabels = { input: 'Choose image' };
const wrongCallbackProps: ComponentProps<typeof ImageAttachmentControl> = {
	...requiredProps,
	// @ts-expect-error Callback receives ImageAttachmentState.
	onvaluechange: (state: string) => { void state; }
};
// @ts-expect-error Validator must accept a native File.
const wrongValidatorParameter: ImageAttachmentFileValidator = (candidate: string) =>
	candidate.length === 0
		? null
		: { code: 'custom', message: 'Invalid image' };
// @ts-expect-error Validator must return a validation error or null.
const wrongValidatorReturn: ImageAttachmentFileValidator = (_candidate: File) => 'invalid';

// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { createImageAttachmentState } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { selectImageAttachmentFile } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { cancelImageAttachmentReplacement } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { chooseImageAttachmentRemoval } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { cancelImageAttachmentRemoval } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { normalizeImageAttachmentState } from '../../src/lib/studio/index.js';
// @ts-expect-error Internal helper is not exported by the Studio barrel.
import { validateImageAttachmentFile } from '../../src/lib/studio/index.js';

void (null as unknown as IntentContract);
void keep;
void replace;
void remove;
void errors;
void completeProps;
void invalidIntent;
void replaceWithNull;
void keepWithFile;
void removeWithFile;
void invalidError;
void missingRequiredProps;
void incompleteLabels;
void wrongCallbackProps;
void wrongValidatorParameter;
void wrongValidatorReturn;
void createImageAttachmentState;
void selectImageAttachmentFile;
void cancelImageAttachmentReplacement;
void chooseImageAttachmentRemoval;
void cancelImageAttachmentRemoval;
void normalizeImageAttachmentState;
void validateImageAttachmentFile;
