[English](component-surface-expansion.md) | [Italiano](it/component-surface-expansion.md)

# Component surface expansion

This document describes the public component families added during the reusable
surface expansion of `giadaware-ui-components`.

All components and public types are imported from the single package root:

```ts
import {
	Accordion,
	AccordionItem,
	Combobox,
	Dialog,
	Disclosure,
	MenuButton,
	MenuItem,
	MenuSeparator,
	NavList,
	Pagination,
	Select,
	Tab,
	TabList,
	TabPanel,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Tabs,
	Textarea,
	TextInput,
	Tooltip
} from 'giadaware-ui-components';
```

No component family introduced by this expansion creates a public package
subpath.

## Ownership boundary

GiadaWare UI owns reusable presentation, native or ARIA interaction semantics,
accessibility behavior assigned to the component, controlled-state contracts,
deterministic IDs where needed, CSS hooks, SSR and hydration behavior.

The consuming application retains routes, fetch and Promise orchestration,
persistence, schemas, localization lookup, domain filtering, domain state,
application navigation policy and other workflow-specific behavior.

## Native field primitives

### TextInput

`TextInput` wraps one native `input` and exposes a bindable string `value`.

Supported component-owned input types are:

- `text`;
- `email`;
- `password`;
- `search`;
- `tel`;
- `url`.

Applicable native input attributes remain consumer-provided.

### Textarea

`Textarea` wraps one native `textarea` and exposes a bindable string `value`.

The `resize` contract is:

- `block`: vertical resize;
- `inline`: horizontal resize;
- `both`: both axes;
- `none`: no user resize.

### Select

`Select` preserves the native `select` element and consumer-provided option
content.

Single-select mode uses a `string | null | undefined` value. Multiple-select
mode is selected explicitly with `multiple` and uses a `string[]` value.

`Select` does not implement filtering, remote loading or editable combobox
behavior.

## Disclosure and accordion

### Disclosure

`Disclosure` is one native `details`/`summary` disclosure with bindable `open`
state.

The consumer provides both summary and body content.

### Accordion

`Accordion` coordinates a collection of `AccordionItem` components.

Single-open mode uses the native `details[name]` grouping mechanism.
`multiple={true}` permits independent open items.

`AccordionItem` keeps native `details`/`summary` semantics and exposes bindable
`open` state. GiadaWare UI does not replace the native disclosure model with a
custom ARIA state machine.

## Dialog

`Dialog` is a controlled generic native-dialog primitive.

The public state contract is `open` plus `onopenchange`.

GiadaWare UI owns:

- native modal lifecycle through `showModal()`;
- Escape and backdrop close intent;
- focus placement when opening;
- focus restoration when closing;
- resilience when a controlled close request is rejected;
- deterministic SSR and hydration behavior.

The consumer owns application actions, form submission, confirmation policy,
copy and domain workflow.

`Dialog` is distinct from `ImageLightbox`. A generic dialog must not infer
image-gallery behavior.

## Tabs

The Tabs family contains:

- `Tabs`;
- `TabList`;
- `Tab`;
- `TabPanel`.

`Tabs` is controlled through `value` and `onvaluechange`.

Activation can be:

- `automatic`: focus movement requests selection;
- `manual`: focus moves independently and native button activation requests
  selection.

`TabList` supports horizontal or vertical orientation, arrow-key navigation,
Home and End, disabled-tab skipping and wrapping.

GiadaWare UI owns deterministic tab/panel IDs and the required ARIA
relationships. The consumer owns route synchronization, URL state,
persistence and domain interpretation.

Values must identify the intended tab/panel relationship consistently within
one Tabs root.

## MenuButton

The menu family contains:

- `MenuButton`;
- `MenuItem`;
- `MenuSeparator`.

`MenuButton` owns one native trigger button and a `role="menu"` popup.

The component owns transient open state, arrow-key navigation, Home/End,
disabled-item skipping, Escape close, Tab close without trapping focus,
outside-pointer close and trigger-focus restoration after item activation.

`MenuItem` is a native button with menu-item semantics.

This family represents an action menu. It is not a generic `Dropdown`, select
replacement, persistent selection model or router abstraction.

## Combobox

`Combobox` is an editable ARIA combobox using `aria-activedescendant`. DOM focus
remains on the native input while the active option changes.

The public controlled data contract separates:

- `query`: current editable text;
- `value`: optional committed value;
- `options`: already prepared consumer options;
- `onquerychange`;
- `onvaluechange`.

GiadaWare UI owns popup visibility, active-option navigation, disabled-option
skipping, option activation, deterministic IDs and ARIA relationships.

The consumer owns filtering, remote fetching, debouncing, persistence,
localization and domain interpretation.

Typing changes `query`; it does not implicitly clear the committed `value`.

Option values should be unique within one option set so committed selection has
one unambiguous semantic match.

## Tooltip

`Tooltip` is a non-interactive descriptive popup.

The consumer renders the trigger through the provided trigger snippet and
applies the supplied trigger props to the interactive element.

GiadaWare UI owns:

- `aria-describedby`;
- focus and pointer visibility behavior;
- Escape dismissal;
- deterministic tooltip ID;
- `role="tooltip"`.

Tooltip content must remain non-interactive. Application actions belong in
another component family.

## Pagination

`Pagination` is controlled through:

- `page`;
- `pageCount`;
- `onpagechange`;
- consumer-resolved labels.

It renders native buttons for Previous, numbered pages and Next, and applies
`aria-current="page"` to the current page.

GiadaWare UI owns presentation, page-control semantics and boundary disabling.
The consumer owns URL state, page size, total-record interpretation, fetches and
persistence.

The current contract renders all page numbers. It does not yet own ellipsis or
windowing policy.

## Navigation

`NavList` renders native:

```text
nav
└── ul
    └── li
        └── a
```

The consumer supplies hrefs and labels.

`current: true` maps to `aria-current="page"`. Explicit supported
`aria-current` tokens can be supplied through `NavListCurrent`.

`NavList` does not own router integration, breadcrumbs, nested navigation state
or application route policy.

## Table primitives

The table family contains:

- `Table`;
- `TableCaption`;
- `TableHead`;
- `TableBody`;
- `TableRow`;
- `TableHeaderCell`;
- `TableCell`.

Each component preserves the corresponding native HTML table element.

The family intentionally provides semantic table structure and styling hooks
only. It is not a data grid and does not own sorting, filtering, selection,
virtualization, pagination, row actions or keyboard grid interaction.

## Accessibility and native semantics

The expansion deliberately prefers native HTML where it already provides the
correct interaction model:

- `input`;
- `textarea`;
- `select`;
- `details` / `summary`;
- `dialog`;
- `button`;
- `nav`;
- table elements.

ARIA interaction models are introduced only where native HTML does not provide
the required composite behavior, notably Tabs, MenuButton, Combobox and
Tooltip.

Consumers must preserve accessible labels, document structure and
application-specific relationships that remain outside each component's public
contract.

## SSR and hydration

The expanded component surface is tested for deterministic SSR and hydration.

Interactive composite families additionally have focused browser tests for
keyboard behavior, focus ownership, controlled-state requests and
accessibility.

Consumers must not treat SSR success alone as evidence of browser or hydration
correctness.

## Styling

Each family exposes scoped `--giu-*` CSS custom properties.

Consumer `class` and inline `style` values compose where included by the public
contract. Internal descendant classes are implementation details unless a
focused public document explicitly says otherwise.

The package introduces no hidden network, font or runtime third-party
dependency for these components.

## Final contract notes

- `Combobox` option `value` fields **must be unique** within one option set. Option identity, active-descendant IDs and controlled selection are value/index based and duplicate values are outside the supported contract.
- `Combobox`'s public `id` names the component root contract. The native editable input uses the derived ID `${id}-input`; external `<label for>` associations must therefore target that derived input ID.
- `Select.multiple` is a construction-mode choice. Switching `multiple` at runtime replaces the native `<select>` node because Svelte requires distinct single-value and multiple-value bindings. Consumers must not rely on focus or DOM-node identity surviving such a mode switch.
