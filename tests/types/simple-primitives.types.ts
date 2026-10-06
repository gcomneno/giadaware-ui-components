import type { Snippet } from 'svelte';

import type {
	DisclosureProps,
	NavListCurrent,
	NavListProps,
	SelectMultipleProps,
	SelectSingleProps,
	TableCellProps,
	TableHeaderCellProps,
	TableProps,
	TextareaProps,
	TextInputProps
} from '../../src/lib/studio/index.js';

declare const children: Snippet;
declare const summary: Snippet;

const textInput: TextInputProps = {
	type: 'email',
	value: 'user@example.test',
	name: 'email',
	required: true
};

const textarea: TextareaProps = {
	value: 'notes',
	resize: 'inline',
	rows: 4
};

const singleSelect: SelectSingleProps = {
	children,
	value: 'alpha',
	name: 'choice'
};

const multipleSelect: SelectMultipleProps = {
	children,
	multiple: true,
	value: ['alpha', 'beta'],
	name: 'choices'
};

const disclosure: DisclosureProps = {
	summary,
	children,
	open: true
};

const current: NavListCurrent = 'page';

const navList: NavListProps = {
	'aria-label': 'Sections',
	items: [
		{
			href: '/overview',
			label: 'Overview',
			current: 'page'
		}
	]
};

const table: TableProps = {
	children,
	'aria-label': 'Data'
};

const headerCell: TableHeaderCellProps = {
	children,
	scope: 'col'
};

const cell: TableCellProps = {
	children,
	colspan: 2
};

void textInput;
void textarea;
void singleSelect;
void multipleSelect;
void disclosure;
void current;
void navList;
void table;
void headerCell;
void cell;

const invalidInput: TextInputProps = {
	// @ts-expect-error unsupported TextInput type
	type: 'number'
};

const invalidMultiple: SelectMultipleProps = {
	children,
	multiple: true,
	// @ts-expect-error multiple Select requires an array value
	value: 'alpha'
};

const invalidSingle: SelectSingleProps = {
	children,
	// @ts-expect-error single Select cannot opt into multiple mode
	multiple: true
};

void invalidInput;
void invalidMultiple;
void invalidSingle;
