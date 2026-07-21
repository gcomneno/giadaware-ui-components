import ImageAttachmentControlImplementation from './ImageAttachmentControl.svelte';
import AsyncOperationPanelImplementation from './AsyncOperationPanel.svelte';

import type { Component, ComponentProps } from 'svelte';
import type { AsyncOperationPanelProps } from './async-operation-panel.js';
import type {
	ImageAttachmentControlLabels,
	ImageAttachmentCurrentImage,
	ImageAttachmentFileValidator,
	ImageAttachmentState
} from './image-attachment-control.js';

type ImageAttachmentControlProps = {
	value: ImageAttachmentState;
	onvaluechange: (value: ImageAttachmentState) => void;
	currentImage?: ImageAttachmentCurrentImage | null;
	disabled?: boolean;
	accept?: string;
	maxSizeBytes?: number;
	validator?: ImageAttachmentFileValidator;
	invalidTypeMessage: string;
	tooLargeMessage: string;
	labels: ImageAttachmentControlLabels;
	name?: string;
	id?: string;
	class?: string;
	style?: string;
};

type Assert<T extends true> = T;
type PropsAreEqual =
	ImageAttachmentControlProps extends ComponentProps<typeof ImageAttachmentControlImplementation>
		? ComponentProps<typeof ImageAttachmentControlImplementation> extends ImageAttachmentControlProps
			? true
			: false
		: false;
type _PropsAreSynchronized = Assert<PropsAreEqual>;
type AsyncPropsAreEqual =
	AsyncOperationPanelProps extends ComponentProps<typeof AsyncOperationPanelImplementation>
		? ComponentProps<typeof AsyncOperationPanelImplementation> extends AsyncOperationPanelProps
			? true
			: false
		: false;
type _AsyncPropsAreSynchronized = Assert<AsyncPropsAreEqual>;

export const AsyncOperationPanel: Component<AsyncOperationPanelProps, {}, ''> =
	AsyncOperationPanelImplementation;

export const ImageAttachmentControl: Component<ImageAttachmentControlProps, {}, ''> =
	ImageAttachmentControlImplementation;

export type {
	ImageAttachmentControlLabels,
	ImageAttachmentCurrentImage,
	ImageAttachmentFileValidator,
	ImageAttachmentIntent,
	ImageAttachmentState,
	ImageAttachmentValidationError
} from './image-attachment-control.js';

export type { AsyncOperationHeadingLevel, AsyncOperationPanelProps, AsyncOperationState } from './async-operation-panel.js';
