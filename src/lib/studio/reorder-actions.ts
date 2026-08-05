export type ReorderActionsSize = 'default' | 'compact';

export type ReorderActionsProps = {
	moveUpLabel: string;
	moveDownLabel: string;
	onMoveUp: () => void;
	onMoveDown: () => void;
	canMoveUp?: boolean;
	canMoveDown?: boolean;
	size?: ReorderActionsSize;
	class?: string;
	style?: string;
};
