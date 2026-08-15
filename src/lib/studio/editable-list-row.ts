import type { Snippet } from 'svelte';

export type EditableListRowDropPosition = 'before' | 'after';

export type EditableListRowDragCandidate = {
	sourceId: string;
	targetId: string;
	position: EditableListRowDropPosition;
};

export type EditableListRowDragCancelReason =
	| 'pointercancel'
	| 'lostpointercapture'
	| 'escape';

export type EditableListRowDrag = {
	id: string;
	label: string;
	disabled?: boolean;
	candidate?: EditableListRowDragCandidate | null;
	onDragStart?: (sourceId: string) => void;
	onDragCandidate?: (candidate: EditableListRowDragCandidate | null) => void;
	onDrop: (candidate: EditableListRowDragCandidate) => void;
	onDragCancel?: (reason: EditableListRowDragCancelReason) => void;
};

export type EditableListRowProps = {
	position: number;
	fields: Snippet;
	actions?: Snippet;
	drag?: EditableListRowDrag;
	class?: string;
	style?: string;
};
