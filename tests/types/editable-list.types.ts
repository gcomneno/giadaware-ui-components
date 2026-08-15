import { EditableList, EditableListRow, ReorderActions } from '../../src/lib/studio/index.js';
import type {
	EditableListProps,
	EditableListRowDrag,
	EditableListRowDragCancelReason,
	EditableListRowDragCandidate,
	EditableListRowDropPosition,
	EditableListRowProps,
	ReorderActionsPositionContext,
	ReorderActionsProps,
	ReorderActionsSize
} from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const snippet: Snippet;

const list: EditableListProps = { legend: 'Gallery', description: snippet, empty: snippet, children: snippet, isEmpty: false, addAction: snippet, class: 'list', style: '--giu-editable-list-row-gap: 1rem' };
const dropPosition: EditableListRowDropPosition = 'before';
const dragCandidate: EditableListRowDragCandidate = { sourceId: 'hero', targetId: 'detail', position: dropPosition };
const dragCancelReason: EditableListRowDragCancelReason = 'escape';
const drag: EditableListRowDrag = {
	id: 'hero',
	label: 'Drag hero image',
	disabled: false,
	candidate: { sourceId: 'hero', targetId: 'detail', position: 'after' },
	onDragStart: (sourceId) => { void sourceId; },
	onDragCandidate: (candidate) => { void candidate; },
	onDrop: (candidate) => { void candidate; },
	onDragCancel: (reason) => { void reason; }
};
const row: EditableListRowProps = { position: 1, fields: snippet, actions: snippet, drag, class: 'row', style: '--giu-editable-list-row-padding: 1rem' };
const size: ReorderActionsSize = 'compact';
const positionContext: ReorderActionsPositionContext = { id: 'hero-reorder-context', text: 'Hero image, position 1 of 3' };
const actions: ReorderActionsProps = { moveUpLabel: 'Move item up', moveDownLabel: 'Move item down', onMoveUp: () => {}, onMoveDown: () => {}, canMoveUp: false, canMoveDown: true, positionContext, size };

// @ts-expect-error legend is required
const missingLegend: EditableListProps = {};
// @ts-expect-error fields is required
const missingFields: EditableListRowProps = { position: 1 };
// @ts-expect-error positions are numbers
const invalidPosition: EditableListRowProps = { position: 'first', fields: snippet };
// @ts-expect-error drag id is required
const missingDragId: EditableListRowDrag = { label: 'Drag image', onDrop: () => {} };
// @ts-expect-error drag label is required
const missingDragLabel: EditableListRowDrag = { id: 'hero', onDrop: () => {} };
// @ts-expect-error drag drop callback is required
const missingDragDrop: EditableListRowDrag = { id: 'hero', label: 'Drag image' };
// @ts-expect-error drop positions are closed
const invalidDropPosition: EditableListRowDropPosition = 'inside';
// @ts-expect-error candidates require source identity
const missingCandidateSource: EditableListRowDragCandidate = { targetId: 'detail', position: 'before' };
// @ts-expect-error drag candidate uses the public complete candidate shape
const oldPartialDragCandidate: EditableListRowDrag = { id: 'hero', label: 'Drag image', candidate: { targetId: 'detail', position: 'before' }, onDrop: () => {} };
// @ts-expect-error candidate position is closed
const invalidCandidatePosition: EditableListRowDragCandidate = { sourceId: 'hero', targetId: 'detail', position: 'inside' };
// @ts-expect-error cancellation reasons are closed
const invalidCancelReason: EditableListRowDragCancelReason = 'drop';
// @ts-expect-error callbacks do not accept payloads
const invalidCallback: ReorderActionsProps = { moveUpLabel: 'Up', moveDownLabel: 'Down', onMoveUp: (value: number) => void value, onMoveDown: () => {} };
// @ts-expect-error size is closed
const invalidSize: ReorderActionsSize = 'large';
// @ts-expect-error position context id is required when positionContext is present
const missingPositionContextId: ReorderActionsPositionContext = { text: 'Hero image, position 1 of 3' };
// @ts-expect-error position context text is required when positionContext is present
const missingPositionContextText: ReorderActionsPositionContext = { id: 'hero-reorder-context' };
// @ts-expect-error ReorderActions does not own numeric position
const invalidReorderActionsPosition: ReorderActionsProps = { moveUpLabel: 'Up', moveDownLabel: 'Down', onMoveUp: () => {}, onMoveDown: () => {}, position: 1 };
// @ts-expect-error ReorderActions does not own numeric total
const invalidReorderActionsTotal: ReorderActionsProps = { moveUpLabel: 'Up', moveDownLabel: 'Down', onMoveUp: () => {}, onMoveDown: () => {}, total: 3 };
// @ts-expect-error normalizers are not Studio exports
import { normalizeReorderActionsSize } from '../../src/lib/studio/index.js';
// @ts-expect-error EditableListRowDrag is Studio-only.
import { EditableListRowDrag as RootEditableListRowDrag } from '../../src/lib/index.js';
// @ts-expect-error EditableListRowDrag is Studio-only.
import { EditableListRowDrag as VisitorEditableListRowDrag } from '../../src/lib/visitor/index.js';
// @ts-expect-error ReorderActionsPositionContext is Studio-only.
import { ReorderActionsPositionContext as RootReorderActionsPositionContext } from '../../src/lib/index.js';
// @ts-expect-error ReorderActionsPositionContext is Studio-only.
import { ReorderActionsPositionContext as VisitorReorderActionsPositionContext } from '../../src/lib/visitor/index.js';

void [
	EditableList,
	EditableListRow,
	ReorderActions,
	list,
	row,
	drag,
	dragCandidate,
	dragCancelReason,
	dropPosition,
	actions,
	positionContext,
	missingLegend,
	missingFields,
	invalidPosition,
	missingDragId,
	missingDragLabel,
	missingDragDrop,
	invalidDropPosition,
	missingCandidateSource,
	oldPartialDragCandidate,
	invalidCandidatePosition,
	invalidCancelReason,
	invalidCallback,
	invalidSize,
	missingPositionContextId,
	missingPositionContextText,
	invalidReorderActionsPosition,
	invalidReorderActionsTotal,
	normalizeReorderActionsSize,
	RootEditableListRowDrag,
	VisitorEditableListRowDrag,
	RootReorderActionsPositionContext,
	VisitorReorderActionsPositionContext
];
