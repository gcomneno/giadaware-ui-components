export type FormStatusTone =
	| 'success'
	| 'error'
	| 'warning'
	| 'info';

const FORM_STATUS_TONES: ReadonlySet<string> = new Set([
	'success',
	'error',
	'warning',
	'info'
]);

export function normalizeFormStatusTone(
	value: unknown
): FormStatusTone {
	return typeof value === 'string' && FORM_STATUS_TONES.has(value)
		? (value as FormStatusTone)
		: 'info';
}
