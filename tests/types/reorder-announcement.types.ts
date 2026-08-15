import { ReorderAnnouncement } from '../../src/lib/studio/index.js';
import type {
	ReorderAnnouncementKey,
	ReorderAnnouncementProps
} from '../../src/lib/studio/index.js';
import type { ComponentProps } from 'svelte';

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends
	(<Value>() => Value extends Right ? 1 : 2)
		? true
		: false;

type Expect<Value extends true> = Value;

type ReorderAnnouncementKeyContract = Expect<
	Equal<ReorderAnnouncementKey, string | number>
>;

type ReorderAnnouncementPropsContract = Expect<
	Equal<ComponentProps<typeof ReorderAnnouncement>, ReorderAnnouncementProps>
>;

const props: ReorderAnnouncementProps = {
	message: 'Moved image',
	eventKey: 1,
	class: 'consumer-announcement',
	style: '--giu-reorder-announcement-size: 2px'
};

const nullableProps: ComponentProps<typeof ReorderAnnouncement> = {
	message: null,
	eventKey: null
};

// @ts-expect-error message is required.
const missingMessage: ReorderAnnouncementProps = { eventKey: 1 };

// @ts-expect-error eventKey is required.
const missingEventKey: ReorderAnnouncementProps = { message: 'Moved image' };

// @ts-expect-error event keys are only string or number when present.
const invalidEventKey: ReorderAnnouncementKey = Symbol('event');

// @ts-expect-error ReorderAnnouncement is Studio-only.
import { ReorderAnnouncement as RootReorderAnnouncement } from '../../src/lib/index.js';

// @ts-expect-error ReorderAnnouncement is Studio-only.
import { ReorderAnnouncement as VisitorReorderAnnouncement } from '../../src/lib/visitor/index.js';

void (null as
	| ReorderAnnouncementKeyContract
	| ReorderAnnouncementPropsContract
	| null);
void props;
void nullableProps;
void missingMessage;
void missingEventKey;
void invalidEventKey;
void RootReorderAnnouncement;
void VisitorReorderAnnouncement;
