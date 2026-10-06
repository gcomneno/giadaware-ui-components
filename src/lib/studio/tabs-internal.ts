import {
	getContext,
	setContext
} from 'svelte';

import type {
	TabsActivation,
	TabsValue
} from './tabs.js';

type TabsContext = {
	getValue: () => TabsValue;
	getActivation: () => TabsActivation;
	getRootId: () => string;
	requestValue: (value: TabsValue) => void;
	getTabId: (value: TabsValue) => string;
	getPanelId: (value: TabsValue) => string;
};

const TABS_CONTEXT = Symbol('giu-tabs-context');

export function encodeTabsValue(value: TabsValue): string {
	let encoded = 'u';

	for (let index = 0; index < value.length; index += 1) {
		encoded += value.charCodeAt(index).toString(16).padStart(4, '0');
	}

	return encoded;
}

export function createTabId(rootId: string, value: TabsValue): string {
	return `${rootId}-tab-${encodeTabsValue(value)}`;
}

export function createPanelId(rootId: string, value: TabsValue): string {
	return `${rootId}-panel-${encodeTabsValue(value)}`;
}

export function provideTabsContext(context: TabsContext): void {
	setContext(TABS_CONTEXT, context);
}

export function useTabsContext(): TabsContext {
	const context = getContext<TabsContext | undefined>(TABS_CONTEXT);

	if (!context) {
		throw new Error(
			'Tabs family components must be rendered inside a Tabs component.'
		);
	}

	return context;
}
