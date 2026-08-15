export type ReorderActionsSize = 'default' | 'compact';

export type ReorderActionsPositionContext = {
	id: string;
	text: string;
};

export type ReorderActionsProps = {
	moveUpLabel: string;
	moveDownLabel: string;
	onMoveUp: () => void;
	onMoveDown: () => void;
	canMoveUp?: boolean;
	canMoveDown?: boolean;
	positionContext?: ReorderActionsPositionContext;
	size?: ReorderActionsSize;
	class?: string;
	style?: string;
};
