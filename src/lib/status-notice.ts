import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type StatusNoticeTone =
	| 'info'
	| 'success'
	| 'warning'
	| 'error';

export type StatusNoticeAnnouncement = 'polite' | 'assertive';

type StatusNoticeDismissProps =
	| {
			onDismiss?: undefined;
			closeLabel?: undefined;
	  }
	| {
			onDismiss: () => void;
			closeLabel: string;
	  };

export type StatusNoticeProps = StatusNoticeDismissProps & {
	title: string;
	children?: Snippet;
	icon?: Snippet;
	actions?: Snippet;
	tone?: StatusNoticeTone;
	announcement?: StatusNoticeAnnouncement;
	id?: string;
	class?: HTMLAttributes<HTMLDivElement>['class'];
	style?: HTMLAttributes<HTMLDivElement>['style'];
};

const STATUS_NOTICE_TONES: ReadonlySet<string> = new Set([
	'info',
	'success',
	'warning',
	'error'
]);

export function normalizeStatusNoticeTone(
	value: unknown
): StatusNoticeTone {
	return typeof value === 'string' && STATUS_NOTICE_TONES.has(value)
		? (value as StatusNoticeTone)
		: 'info';
}

export function normalizeStatusNoticeAnnouncement(
	value: unknown
): StatusNoticeAnnouncement | undefined {
	return value === 'polite' || value === 'assertive' ? value : undefined;
}

export function normalizeStatusNoticeCloseLabel(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}
