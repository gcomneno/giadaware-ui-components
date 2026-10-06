import {
	getContext,
	setContext
} from 'svelte';

type MenuButtonContext = {
	getRootId: () => string;
	closeMenu: (restoreFocus: boolean) => void;
};

const MENU_BUTTON_CONTEXT = Symbol('giu-menu-button-context');

export function provideMenuButtonContext(
	context: MenuButtonContext
): void {
	setContext(MENU_BUTTON_CONTEXT, context);
}

export function useMenuButtonContext(): MenuButtonContext {
	const context = getContext<MenuButtonContext | undefined>(
		MENU_BUTTON_CONTEXT
	);

	if (!context) {
		throw new Error(
			'MenuItem must be rendered inside a MenuButton component.'
		);
	}

	return context;
}
