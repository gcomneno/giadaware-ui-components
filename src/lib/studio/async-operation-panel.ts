import type { Snippet } from 'svelte';

export type AsyncOperationState = 'idle' | 'running' | 'success' | 'warning' | 'error';
export type AsyncOperationHeadingLevel = 2 | 3 | 4 | 5 | 6;

type CommonProps = {
	title: string;
	action: Snippet;
	description?: Snippet;
	headingLevel?: AsyncOperationHeadingLevel;
	id?: string;
	class?: string;
	style?: string;
};

type TechnicalDetailsProps =
	| { technicalDetails?: undefined; technicalDetailsLabel?: undefined; technicalDetailsInitiallyExpanded?: undefined }
	| { technicalDetails: string; technicalDetailsLabel: string; technicalDetailsInitiallyExpanded?: boolean };

type StateProps =
	| { state: 'idle'; busyLabel?: never; message?: never; result?: never }
	| { state: 'running'; busyLabel: string; message?: never; result?: never }
	| { state: 'success' | 'warning' | 'error'; message: string; busyLabel?: never; result?: Snippet };

export type AsyncOperationPanelProps = CommonProps & TechnicalDetailsProps & StateProps;

const ASYNC_OPERATION_STATES: ReadonlySet<string> = new Set([
	'idle',
	'running',
	'success',
	'warning',
	'error'
]);

export function normalizeAsyncOperationState(value: unknown): AsyncOperationState {
	return typeof value === 'string' && ASYNC_OPERATION_STATES.has(value)
		? (value as AsyncOperationState)
		: 'idle';
}

export function normalizeAsyncOperationHeadingLevel(value: unknown): AsyncOperationHeadingLevel {
	return value === 2 || value === 3 || value === 4 || value === 5 || value === 6 ? value : 2;
}
