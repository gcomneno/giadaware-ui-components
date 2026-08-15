import ImageAttachmentControlImplementation from './ImageAttachmentControl.svelte';
import AsyncOperationPanelImplementation from './AsyncOperationPanel.svelte';
import ButtonImplementation from './Button.svelte';
import IconButtonImplementation from './IconButton.svelte';
import FormActionsImplementation from './FormActions.svelte';
import FieldLabelImplementation from './FieldLabel.svelte';
import FieldDescriptionImplementation from './FieldDescription.svelte';
import FieldErrorImplementation from './FieldError.svelte';
import EditableListImplementation from './EditableList.svelte';
import EditableListRowImplementation from './EditableListRow.svelte';
import ReorderActionsImplementation from './ReorderActions.svelte';
import PageIntroImplementation from './PageIntro.svelte';
import PanelImplementation from './Panel.svelte';
import SurfaceImplementation from './Surface.svelte';

import type { Component, ComponentProps } from 'svelte';
import type { AsyncOperationPanelProps } from './async-operation-panel.js';
import type { ButtonProps } from './button.js';
import type { IconButtonProps } from './icon-button.js';
import type { FormActionsProps } from './form-actions.js';
import type { FieldLabelProps } from './field-label.js';
import type { FieldDescriptionProps } from './field-description.js';
import type { FieldErrorProps } from './field-error.js';
import type { EditableListProps } from './editable-list.js';
import type { EditableListRowProps } from './editable-list-row.js';
import type { ReorderActionsProps } from './reorder-actions.js';
import type { PageIntroProps } from './page-intro.js';
import type { PanelProps } from './panel.js';
import type { SurfaceProps } from './surface.js';
import type {
	ImageAttachmentControlLabels,
	ImageAttachmentCurrentImage,
	ImageAttachmentDropzoneOptions,
	ImageAttachmentFileValidator,
	ImageAttachmentState
} from './image-attachment-control.js';

type ImageAttachmentControlProps = {
	value: ImageAttachmentState;
	onvaluechange: (value: ImageAttachmentState) => void;
	currentImage?: ImageAttachmentCurrentImage | null;
	disabled?: boolean;
	dropzone?: ImageAttachmentDropzoneOptions;
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
type IconButtonPropsAreEqual =
	IconButtonProps extends ComponentProps<typeof IconButtonImplementation>
		? ComponentProps<typeof IconButtonImplementation> extends IconButtonProps
			? true
			: false
		: false;
type _IconButtonPropsAreSynchronized = Assert<IconButtonPropsAreEqual>;
type FieldLabelPropsAreEqual =
	FieldLabelProps extends ComponentProps<typeof FieldLabelImplementation>
		? ComponentProps<typeof FieldLabelImplementation> extends FieldLabelProps
			? true
			: false
		: false;
type _FieldLabelPropsAreSynchronized = Assert<FieldLabelPropsAreEqual>;
type FieldDescriptionPropsAreEqual =
	FieldDescriptionProps extends ComponentProps<typeof FieldDescriptionImplementation>
		? ComponentProps<typeof FieldDescriptionImplementation> extends FieldDescriptionProps
			? true
			: false
		: false;
type _FieldDescriptionPropsAreSynchronized = Assert<FieldDescriptionPropsAreEqual>;
type FieldErrorPropsAreEqual =
	FieldErrorProps extends ComponentProps<typeof FieldErrorImplementation>
		? ComponentProps<typeof FieldErrorImplementation> extends FieldErrorProps
			? true
			: false
		: false;
type _FieldErrorPropsAreSynchronized = Assert<FieldErrorPropsAreEqual>;
type EditableListPropsAreEqual =
	EditableListProps extends ComponentProps<typeof EditableListImplementation>
		? ComponentProps<typeof EditableListImplementation> extends EditableListProps
			? true
			: false
		: false;
type _EditableListPropsAreSynchronized = Assert<EditableListPropsAreEqual>;
type EditableListRowPropsAreEqual =
	EditableListRowProps extends ComponentProps<
		typeof EditableListRowImplementation
	>
		? ComponentProps<typeof EditableListRowImplementation> extends EditableListRowProps
			? true
			: false
		: false;
type _EditableListRowPropsAreSynchronized = Assert<EditableListRowPropsAreEqual>;
type ReorderActionsPropsAreEqual =
	ReorderActionsProps extends ComponentProps<typeof ReorderActionsImplementation>
		? ComponentProps<typeof ReorderActionsImplementation> extends ReorderActionsProps
			? true
			: false
		: false;
type _ReorderActionsPropsAreSynchronized = Assert<ReorderActionsPropsAreEqual>;
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
export const IconButton: Component<IconButtonProps, {}, ''> = IconButtonImplementation;

export const FieldLabel: Component<FieldLabelProps, {}, ''> = FieldLabelImplementation;
export const FieldDescription: Component<FieldDescriptionProps, {}, ''> = FieldDescriptionImplementation;
export const FieldError: Component<FieldErrorProps, {}, ''> = FieldErrorImplementation;
export const EditableList: Component<EditableListProps, {}, ''> = EditableListImplementation;
export const EditableListRow: Component<EditableListRowProps, {}, ''> = EditableListRowImplementation;
export const ReorderActions: Component<ReorderActionsProps, {}, ''> = ReorderActionsImplementation;

export const FormActions: Component<FormActionsProps, {}, ''> = FormActionsImplementation;

export const PageIntro: Component<PageIntroProps, {}, ''> = PageIntroImplementation;

export const Panel: Component<PanelProps, {}, ''> = PanelImplementation;

export const Surface: Component<SurfaceProps, {}, ''> = SurfaceImplementation;

export const ImageAttachmentControl: Component<ImageAttachmentControlProps, {}, ''> =
	ImageAttachmentControlImplementation;

export type {
	ImageAttachmentControlLabels,
	ImageAttachmentCurrentImage,
	ImageAttachmentDropzoneOptions,
	ImageAttachmentFileValidator,
	ImageAttachmentIntent,
	ImageAttachmentState,
	ImageAttachmentValidationError
} from './image-attachment-control.js';

export type { AsyncOperationHeadingLevel, AsyncOperationPanelProps, AsyncOperationState } from './async-operation-panel.js';
export type { ButtonProps, ButtonSize, ButtonVariant } from './button.js';
export type { IconButtonProps } from './icon-button.js';
export type { FieldLabelProps } from './field-label.js';
export type { FieldDescriptionProps } from './field-description.js';
export type { FieldErrorProps } from './field-error.js';
export type { EditableListProps } from './editable-list.js';
export type { EditableListRowProps } from './editable-list-row.js';
export type { ReorderActionsProps, ReorderActionsSize } from './reorder-actions.js';
export type { FormActionsAlign, FormActionsProps } from './form-actions.js';
export type { PageIntroProps } from './page-intro.js';
export type { PanelHeadingLevel, PanelProps } from './panel.js';
export type { SurfaceProps } from './surface.js';
