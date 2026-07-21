import { AsyncOperationPanel } from '../../src/lib/studio/index.js';
import type { AsyncOperationPanelProps, AsyncOperationState } from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';
declare const action: Snippet;
declare const result: Snippet;
const valid: AsyncOperationPanelProps[] = [
	{ state: 'idle', title: 'Idle', action },
	{ state: 'running', title: 'Running', action, busyLabel: 'Working' },
	{ state: 'success', title: 'Success', action, message: 'Done', result },
	{ state: 'warning', title: 'Warning', action, message: 'Review' },
	{ state: 'error', title: 'Error', action, message: 'Failed', headingLevel: 6 }
];
// @ts-expect-error running requires busyLabel
const noBusy: AsyncOperationPanelProps = { state: 'running', title: 'Run', action };
// @ts-expect-error terminal state requires message
const noMessage: AsyncOperationPanelProps = { state: 'error', title: 'Error', action };
// @ts-expect-error idle rejects terminal message
const staleMessage: AsyncOperationPanelProps = { state: 'idle', title: 'Idle', action, message: 'Old' };
// @ts-expect-error idle rejects result
const staleResult: AsyncOperationPanelProps = { state: 'idle', title: 'Idle', action, result };
// @ts-expect-error action is required
const noAction: AsyncOperationPanelProps = { state: 'idle', title: 'Idle' };
// @ts-expect-error heading levels start at 2
const badHeading: AsyncOperationPanelProps = { state: 'idle', title: 'Idle', action, headingLevel: 1 };
// @ts-expect-error state is closed
const badState: AsyncOperationState = 'complete';
void [AsyncOperationPanel, valid, noBusy, noMessage, staleMessage, staleResult, noAction, badHeading, badState];
