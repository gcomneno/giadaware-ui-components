import type { ImageAttachmentControlLabels } from '../../src/lib/studio/image-attachment-control.js';

export const IMAGE_ATTACHMENT_CONTROL_HYDRATION_ID = 'hydration-image-input';

export const IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS = {
	input: 'Choose an image',
	cancelReplacement: 'Cancel image replacement',
	remove: 'Remove current image',
	cancelRemoval: 'Cancel image removal',
	keepExistingStatus: 'Current image will be kept',
	keepEmptyStatus: 'No current image',
	replaceStatus: 'A replacement image is selected',
	removeStatus: 'Current image will be removed',
	replacementPreviewAlt: 'Replacement image preview'
} satisfies ImageAttachmentControlLabels;

export const IMAGE_ATTACHMENT_CONTROL_HYDRATION_CURRENT_IMAGE = {
	src: '/images/current-image.png',
	alt: 'Current image preview',
	name: 'current-image.png'
} as const;

export const IMAGE_ATTACHMENT_CONTROL_HYDRATION_MESSAGES = {
	invalidType: 'Choose a supported image type',
	tooLarge: 'Choose a smaller image'
} as const;

export const IMAGE_ATTACHMENT_CONTROL_HYDRATION_SSR_BODY =
	'<!--[--><div data-testid="image-attachment-control-hydration-probe" data-change-count="0"><!--$s1--><div class="image-attachment-control image-attachment-control--keep svelte-d8wee9" data-intent="keep"><!--[1--><div class="image-attachment-control__preview svelte-d8wee9"><img src="/images/current-image.png" alt="Current image preview" class="svelte-d8wee9"/></div> <!--[0--><p class="image-attachment-control__filename svelte-d8wee9">current-image.png</p><!--]--><!--]--> <p class="image-attachment-control__status svelte-d8wee9" role="status" aria-live="polite" aria-atomic="true"><!--[2-->Current image will be kept<!--]--></p> <div class="image-attachment-control__field svelte-d8wee9"><label for="hydration-image-input">Choose an image</label> <input type="file" id="hydration-image-input" accept="image/*" class="svelte-d8wee9"/></div> <!--[-1--><!--]--> <div class="image-attachment-control__actions svelte-d8wee9"><!--[-1--><!--]--> <!--[0--><button type="button" class="svelte-d8wee9">Remove current image</button><!--]--></div></div><!----></div><!--]-->';
