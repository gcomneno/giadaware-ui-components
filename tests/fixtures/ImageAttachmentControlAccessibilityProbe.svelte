<script lang="ts">
	import ImageAttachmentControl from '../../src/lib/studio/ImageAttachmentControl.svelte';

	import type { ImageAttachmentControlLabels, ImageAttachmentState } from '../../src/lib/studio/image-attachment-control.js';

	const labels = (input: string): ImageAttachmentControlLabels => ({
		input,
		cancelReplacement: 'Cancel replacement',
		remove: 'Remove image',
		cancelRemoval: 'Cancel removal',
		keepExistingStatus: 'Current image is kept',
		keepEmptyStatus: 'No image selected',
		replaceStatus: 'Replacement image selected',
		removeStatus: 'Current image marked for removal',
		replacementPreviewAlt: 'Preview of the replacement image'
	});
	const messages = { invalidType: 'Select a PNG image', tooLarge: 'Select a smaller image' };
	const currentImage = { src: '/images/current.png', alt: 'Preview of the current image', name: 'current.png' };
	const replacementFile = new File(['replacement'], 'replacement.png', { type: 'image/png' });
	const noop = (_next: ImageAttachmentState): void => {};

	let emptyValue = $state<ImageAttachmentState>({ intent: 'keep', file: null });
	function updateEmpty(next: ImageAttachmentState): void { emptyValue = next; }
</script>

<div data-testid="image-attachment-control-accessibility-probe">
	<ImageAttachmentControl value={emptyValue} onvaluechange={updateEmpty} id="accessibility-empty-image" accept=".png" invalidTypeMessage={messages.invalidType} tooLargeMessage={messages.tooLarge} labels={labels('Choose an empty-state image')} />
	<ImageAttachmentControl value={{ intent: 'keep', file: null }} onvaluechange={noop} {currentImage} id="accessibility-current-image" invalidTypeMessage={messages.invalidType} tooLargeMessage={messages.tooLarge} labels={labels('Choose a current-image replacement')} />
	<ImageAttachmentControl value={{ intent: 'replace', file: replacementFile }} onvaluechange={noop} id="accessibility-replacement-image" invalidTypeMessage={messages.invalidType} tooLargeMessage={messages.tooLarge} labels={labels('Choose another replacement image')} />
	<ImageAttachmentControl value={{ intent: 'remove', file: null }} onvaluechange={noop} {currentImage} id="accessibility-removed-image" invalidTypeMessage={messages.invalidType} tooLargeMessage={messages.tooLarge} labels={labels('Choose an image after removal')} />
	<ImageAttachmentControl value={{ intent: 'keep', file: null }} onvaluechange={noop} {currentImage} disabled id="accessibility-disabled-image" invalidTypeMessage={messages.invalidType} tooLargeMessage={messages.tooLarge} labels={labels('Choose a disabled image')} />
</div>
