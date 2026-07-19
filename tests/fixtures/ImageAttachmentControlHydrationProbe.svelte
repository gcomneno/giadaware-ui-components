<script lang="ts">
	import ImageAttachmentControl from '../../src/lib/studio/ImageAttachmentControl.svelte';
	import {
		IMAGE_ATTACHMENT_CONTROL_HYDRATION_CURRENT_IMAGE,
		IMAGE_ATTACHMENT_CONTROL_HYDRATION_ID,
		IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS,
		IMAGE_ATTACHMENT_CONTROL_HYDRATION_MESSAGES
	} from './image-attachment-control-hydration-contract.js';

	import type { ImageAttachmentState } from '../../src/lib/studio/image-attachment-control.js';

	let value = $state<ImageAttachmentState>({ intent: 'keep', file: null });
	let changeCount = $state(0);

	function handleValueChange(next: ImageAttachmentState): void {
		changeCount += 1;
		value = next;
	}
</script>

<div
	data-testid="image-attachment-control-hydration-probe"
	data-change-count={changeCount}
>
	<ImageAttachmentControl
		{value}
		onvaluechange={handleValueChange}
		currentImage={IMAGE_ATTACHMENT_CONTROL_HYDRATION_CURRENT_IMAGE}
		id={IMAGE_ATTACHMENT_CONTROL_HYDRATION_ID}
		invalidTypeMessage={IMAGE_ATTACHMENT_CONTROL_HYDRATION_MESSAGES.invalidType}
		tooLargeMessage={IMAGE_ATTACHMENT_CONTROL_HYDRATION_MESSAGES.tooLarge}
		labels={IMAGE_ATTACHMENT_CONTROL_HYDRATION_LABELS}
	/>
</div>
