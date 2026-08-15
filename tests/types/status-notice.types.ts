import { StatusNotice } from '../../src/lib/index.js';

import type {
	StatusNoticeAnnouncement,
	StatusNoticeProps,
	StatusNoticeTone
} from '../../src/lib/index.js';
import type { ComponentProps, Snippet } from 'svelte';

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2)
		? true
		: false;

type Expect<Value extends true> = Value;

type StatusNoticeToneContract = Expect<
	Equal<StatusNoticeTone, 'info' | 'success' | 'warning' | 'error'>
>;

type StatusNoticeAnnouncementContract = Expect<
	Equal<StatusNoticeAnnouncement, 'polite' | 'assertive'>
>;

type StatusNoticePropsContract = Expect<
	Equal<ComponentProps<typeof StatusNotice>, StatusNoticeProps>
>;

declare const body: Snippet;
declare const icon: Snippet;
declare const actions: Snippet;

const staticProps: ComponentProps<typeof StatusNotice> = {
	title: 'Published',
	children: body,
	icon,
	actions,
	tone: 'success',
	announcement: 'polite',
	id: 'publish-notice',
	class: 'consumer-notice',
	style: '--giu-status-notice-padding: 1rem'
};

const dismissibleProps: ComponentProps<typeof StatusNotice> = {
	title: 'Draft removed',
	onDismiss: () => undefined,
	closeLabel: 'Dismiss'
};

// @ts-expect-error StatusNoticeTone is a closed public union.
const invalidTone: StatusNoticeTone = 'neutral';

// @ts-expect-error StatusNoticeAnnouncement is a closed public union.
const invalidAnnouncement: StatusNoticeAnnouncement = 'live';

// @ts-expect-error StatusNotice requires a title.
const missingTitle: ComponentProps<typeof StatusNotice> = {};

// @ts-expect-error onDismiss requires closeLabel.
const missingCloseLabel: ComponentProps<typeof StatusNotice> = {
	title: 'Dismissible',
	onDismiss: () => undefined
};

// @ts-expect-error closeLabel requires onDismiss.
const missingOnDismiss: ComponentProps<typeof StatusNotice> = {
	title: 'Dismissible',
	closeLabel: 'Dismiss'
};

void (null as
	| StatusNoticeToneContract
	| StatusNoticeAnnouncementContract
	| StatusNoticePropsContract
	| null);
void staticProps;
void dismissibleProps;
void invalidTone;
void invalidAnnouncement;
void missingTitle;
void missingCloseLabel;
void missingOnDismiss;
