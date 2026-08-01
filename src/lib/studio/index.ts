import ImageAttachmentControlImplementation from './ImageAttachmentControl.svelte';
import AsyncOperationPanelImplementation from './AsyncOperationPanel.svelte';
import ButtonImplementation from './Button.svelte';
import FormActionsImplementation from './FormActions.svelte';
import FieldLabelImplementation from './FieldLabel.svelte';
import PageIntroImplementation from './PageIntro.svelte';
import PanelImplementation from './Panel.svelte';
import SurfaceImplementation from './Surface.svelte';

import type { Component, ComponentProps } from 'svelte';
import type { AsyncOperationPanelProps } from './async-operation-panel.js';
import type { ButtonProps } from './button.js';
import type { FormActionsProps } from './form-actions.js';
import type { FieldLabelProps } from './field-label.js';
import type { PageIntroProps } from './page-intro.js';
import type { PanelProps } from './panel.js';
import type { SurfaceProps } from './surface.js';
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
type ButtonPropsAreEqual =
	ButtonProps extends ComponentProps<typeof ButtonImplementation>
		? ComponentProps<typeof ButtonImplementation> extends ButtonProps
			? true
			: false
		: false;
type _ButtonPropsAreSynchronized = Assert<ButtonPropsAreEqual>;
type FieldLabelPropsAreEqual =
	FieldLabelProps extends ComponentProps<typeof FieldLabelImplementation>
		? ComponentProps<typeof FieldLabelImplementation> extends FieldLabelProps
			? true
			: false
		: false;
type _FieldLabelPropsAreSynchronized = Assert<FieldLabelPropsAreEqual>;
type FormActionsPropsAreEqual =
	FormActionsProps extends ComponentProps<typeof FormActionsImplementation>
		? ComponentProps<typeof FormActionsImplementation> extends FormActionsProps
			? true
			: false
		: false;
type _FormActionsPropsAreSynchronized = Assert<FormActionsPropsAreEqual>;
type PageIntroPropsAreEqual =
	PageIntroProps extends ComponentProps<typeof PageIntroImplementation>
		? ComponentProps<typeof PageIntroImplementation> extends PageIntroProps
			? true
			: false
		: false;
type _PageIntroPropsAreSynchronized = Assert<PageIntroPropsAreEqual>;
type PanelPropsAreEqual =
	PanelProps extends ComponentProps<typeof PanelImplementation>
		? ComponentProps<typeof PanelImplementation> extends PanelProps
			? true
			: false
		: false;
type _PanelPropsAreSynchronized = Assert<PanelPropsAreEqual>;
type SurfacePropsAreEqual =
	SurfaceProps extends ComponentProps<typeof SurfaceImplementation>
		? ComponentProps<typeof SurfaceImplementation> extends SurfaceProps
			? true
			: false
		: false;
type _SurfacePropsAreSynchronized = Assert<SurfacePropsAreEqual>;

export const AsyncOperationPanel: Component<AsyncOperationPanelProps, {}, ''> =
	AsyncOperationPanelImplementation;

export const Button: Component<ButtonProps, {}, ''> = ButtonImplementation;

export const FieldLabel: Component<FieldLabelProps, {}, ''> = FieldLabelImplementation;

export const FormActions: Component<FormActionsProps, {}, ''> = FormActionsImplementation;

export const PageIntro: Component<PageIntroProps, {}, ''> = PageIntroImplementation;

export const Panel: Component<PanelProps, {}, ''> = PanelImplementation;

export const Surface: Component<SurfaceProps, {}, ''> = SurfaceImplementation;

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
export type { ButtonProps, ButtonSize, ButtonVariant } from './button.js';
export type { FieldLabelProps } from './field-label.js';
export type { FormActionsAlign, FormActionsProps } from './form-actions.js';
export type { PageIntroProps } from './page-intro.js';
export type { PanelHeadingLevel, PanelProps } from './panel.js';
export type { SurfaceProps } from './surface.js';
