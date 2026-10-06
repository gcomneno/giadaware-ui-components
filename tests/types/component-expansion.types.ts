import type { Snippet } from 'svelte';

import {
	Accordion,
	AccordionItem,
	Combobox,
	Dialog,
	MenuButton,
	MenuItem,
	MenuSeparator,
	Pagination,
	Tab,
	TabList,
	TabPanel,
	Tabs,
	Tooltip
} from '../../src/lib/index.js';

import type {
	AccordionItemProps,
	AccordionProps,
	ComboboxOption,
	ComboboxProps,
	DialogProps,
	MenuButtonProps,
	MenuItemProps,
	MenuSeparatorProps,
	PaginationLabels,
	PaginationProps,
	TabListProps,
	TabPanelProps,
	TabProps,
	TabsProps,
	TooltipProps,
	TooltipTriggerProps
} from '../../src/lib/index.js';

declare const children: Snippet;
declare const summary: Snippet;
declare const menuTrigger: Snippet;

const accordion: AccordionProps = {
	children,
	multiple: false,
	class: 'consumer-accordion'
};

const accordionItem: AccordionItemProps = {
	summary,
	children,
	open: true
};

const dialog: DialogProps = {
	open: false,
	onopenchange: (open) => open,
	children,
	'aria-label': 'Example dialog'
};

const paginationLabels: PaginationLabels = {
	navigation: 'Pagination',
	previous: 'Previous',
	next: 'Next',
	page: (page) => `Page ${page}`
};

const pagination: PaginationProps = {
	page: 2,
	pageCount: 5,
	onpagechange: (page) => page,
	labels: paginationLabels
};

const options: readonly ComboboxOption[] = [
	{
		value: 'alpha',
		label: 'Alpha'
	},
	{
		value: 'beta',
		label: 'Beta',
		disabled: true
	}
];

const combobox: ComboboxProps = {
	query: 'Al',
	value: 'alpha',
	options,
	onquerychange: (query) => query,
	onvaluechange: (value) => value,
	name: 'example'
};

const tabs: TabsProps = {
	value: 'overview',
	onvaluechange: (value) => value,
	activation: 'manual',
	children
};

const tabList: TabListProps = {
	orientation: 'vertical',
	children
};

const tab: TabProps = {
	value: 'overview',
	children
};

const tabPanel: TabPanelProps = {
	value: 'overview',
	children
};

const tooltipTriggerProps: TooltipTriggerProps = {
	'aria-describedby': 'tip',
	onfocus: () => {},
	onblur: () => {},
	onpointerenter: () => {},
	onpointerleave: () => {},
	onkeydown: () => {}
};

const tooltip: TooltipProps = {
	trigger: menuTrigger,
	children,
	id: 'tip'
};

const menuButton: MenuButtonProps = {
	trigger: menuTrigger,
	children,
	id: 'actions'
};

const menuItem: MenuItemProps = {
	children,
	disabled: false
};

const menuSeparator: MenuSeparatorProps = {
	class: 'consumer-separator'
};

const invalidPagination: PaginationProps = {
	page: 1,
	pageCount: 2,
	onpagechange: (page) => page,
	labels: {
		navigation: 'Pagination',
		previous: 'Previous',
		next: 'Next',
		// @ts-expect-error page label must be a function
		page: 'Page'
	}
};

const invalidCombobox: ComboboxProps = {
	query: '',
	options,
	onquerychange: (query) => query,
	// @ts-expect-error committed value callback receives a string
	onvaluechange: (value: number) => value
};

const invalidTabs: TabsProps = {
	value: 'overview',
	onvaluechange: (value) => value,
	// @ts-expect-error unsupported activation mode
	activation: 'focus',
	children
};

const invalidTabList: TabListProps = {
	// @ts-expect-error unsupported orientation
	orientation: 'diagonal',
	children
};

void [
	Accordion,
	AccordionItem,
	Combobox,
	Dialog,
	MenuButton,
	MenuItem,
	MenuSeparator,
	Pagination,
	Tab,
	TabList,
	TabPanel,
	Tabs,
	Tooltip,
	accordion,
	accordionItem,
	dialog,
	paginationLabels,
	pagination,
	options,
	combobox,
	tabs,
	tabList,
	tab,
	tabPanel,
	tooltipTriggerProps,
	tooltip,
	menuButton,
	menuItem,
	menuSeparator,
	invalidPagination,
	invalidCombobox,
	invalidTabs,
	invalidTabList
];
