import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(
	await readFile(new URL('../package.json', import.meta.url), 'utf8')
);
const formStatusSource = await readFile(
	new URL(
		'../src/lib/internal/FormStatusPresentation.svelte',
		import.meta.url
	),
	'utf8'
);
const statusNoticeSource = await readFile(
	new URL('../src/lib/StatusNotice.svelte', import.meta.url),
	'utf8'
);
const statusNoticeContract = await readFile(
	new URL('../src/lib/status-notice.ts', import.meta.url),
	'utf8'
);
const socialLinkSource = await readFile(
	new URL('../src/lib/SocialLink.svelte', import.meta.url),
	'utf8'
);
const socialLinkContract = await readFile(
	new URL('../src/lib/social-link.ts', import.meta.url),
	'utf8'
);
const asyncOperationPanelSource = await readFile(
	new URL('../src/lib/studio/AsyncOperationPanel.svelte', import.meta.url),
	'utf8'
);
const asyncOperationPanelContract = await readFile(
	new URL('../src/lib/studio/async-operation-panel.ts', import.meta.url),
	'utf8'
);
const buttonSource = await readFile(
	new URL('../src/lib/studio/Button.svelte', import.meta.url),
	'utf8'
);
const buttonContract = await readFile(
	new URL('../src/lib/studio/button.ts', import.meta.url),
	'utf8'
);
const iconButtonSource = await readFile(
	new URL('../src/lib/studio/IconButton.svelte', import.meta.url),
	'utf8'
);
const iconButtonContract = await readFile(
	new URL('../src/lib/studio/icon-button.ts', import.meta.url),
	'utf8'
);
const fieldLabelSource = await readFile(
	new URL('../src/lib/studio/FieldLabel.svelte', import.meta.url),
	'utf8'
);
const fieldLabelContract = await readFile(
	new URL('../src/lib/studio/field-label.ts', import.meta.url),
	'utf8'
);
const fieldDescriptionSource = await readFile(
	new URL('../src/lib/studio/FieldDescription.svelte', import.meta.url),
	'utf8'
);
const fieldDescriptionContract = await readFile(
	new URL('../src/lib/studio/field-description.ts', import.meta.url),
	'utf8'
);
const fieldErrorSource = await readFile(
	new URL('../src/lib/studio/FieldError.svelte', import.meta.url),
	'utf8'
);
const fieldErrorContract = await readFile(
	new URL('../src/lib/studio/field-error.ts', import.meta.url),
	'utf8'
);
const formActionsSource = await readFile(
	new URL('../src/lib/studio/FormActions.svelte', import.meta.url),
	'utf8'
);
const formActionsContract = await readFile(
	new URL('../src/lib/studio/form-actions.ts', import.meta.url),
	'utf8'
);
const editableListRowSource = await readFile(
	new URL('../src/lib/studio/EditableListRow.svelte', import.meta.url),
	'utf8'
);
const editableListRowContract = await readFile(
	new URL('../src/lib/studio/editable-list-row.ts', import.meta.url),
	'utf8'
);
const reorderActionsSource = await readFile(
	new URL('../src/lib/studio/ReorderActions.svelte', import.meta.url),
	'utf8'
);
const reorderActionsContract = await readFile(
	new URL('../src/lib/studio/reorder-actions.ts', import.meta.url),
	'utf8'
);
const reorderAnnouncementSource = await readFile(
	new URL('../src/lib/studio/ReorderAnnouncement.svelte', import.meta.url),
	'utf8'
);
const reorderAnnouncementContract = await readFile(
	new URL('../src/lib/studio/reorder-announcement.ts', import.meta.url),
	'utf8'
);
const panelSource = await readFile(
	new URL('../src/lib/studio/Panel.svelte', import.meta.url),
	'utf8'
);
const panelContract = await readFile(
	new URL('../src/lib/studio/panel.ts', import.meta.url),
	'utf8'
);
const surfaceSource = await readFile(
	new URL('../src/lib/studio/Surface.svelte', import.meta.url),
	'utf8'
);
const surfaceContract = await readFile(
	new URL('../src/lib/studio/surface.ts', import.meta.url),
	'utf8'
);

const errors = [];

function requireValue(condition, message) {
	if (!condition) {
		errors.push(message);
	}
}

requireValue(
	manifest.name === 'giadaware-ui-components',
	'unexpected package name'
);

requireValue(
	statusNoticeContract.includes("import type { Snippet } from 'svelte'") &&
		statusNoticeContract.includes("type StatusNoticeDismissProps") &&
		statusNoticeContract.includes('onDismiss?: undefined') &&
		statusNoticeContract.includes('closeLabel?: undefined') &&
		statusNoticeContract.includes('onDismiss: () => void') &&
		statusNoticeContract.includes('closeLabel: string') &&
		statusNoticeContract.includes('title: string') &&
		statusNoticeContract.includes('children?: Snippet') &&
		statusNoticeContract.includes('icon?: Snippet') &&
		statusNoticeContract.includes('actions?: Snippet') &&
		statusNoticeContract.includes("export type StatusNoticeTone") &&
		statusNoticeContract.includes("'info'") &&
		statusNoticeContract.includes("'success'") &&
		statusNoticeContract.includes("'warning'") &&
		statusNoticeContract.includes("'error'") &&
		statusNoticeContract.includes("export type StatusNoticeAnnouncement") &&
		statusNoticeContract.includes("'polite'") &&
		statusNoticeContract.includes("'assertive'"),
	'StatusNotice must expose the root public snippet contract with the dismissal invariant'
);

requireValue(
	statusNoticeSource.includes("normalizeStatusNoticeTone(tone)") &&
		statusNoticeSource.includes(
			'normalizeStatusNoticeAnnouncement(announcement)'
		) &&
		statusNoticeSource.includes(
			'normalizeStatusNoticeCloseLabel(closeLabel)'
		) &&
		statusNoticeSource.includes(
			"normalizedAnnouncement === 'polite'"
		) &&
		statusNoticeSource.includes(
			"normalizedAnnouncement === 'assertive'"
		) &&
		statusNoticeSource.includes("role={announcementRole}") &&
		statusNoticeSource.includes('aria-live={normalizedAnnouncement}') &&
		statusNoticeSource.includes(
			"aria-atomic={normalizedAnnouncement ? 'true' : undefined}"
		) &&
		statusNoticeSource.includes(
			'class="giu-status-notice__announcement"'
		),
	'StatusNotice live-region semantics must be explicit and normalized on the announcement subregion'
);

requireValue(
	statusNoticeSource.includes('<button') &&
		statusNoticeSource.includes('type="button"') &&
		statusNoticeSource.includes('onclick={onDismiss}') &&
		statusNoticeSource.includes('{#if canDismiss}') &&
		statusNoticeSource.includes("typeof onDismiss === 'function'") &&
		statusNoticeSource.includes('Boolean(normalizedCloseLabel)') &&
		!statusNoticeSource.includes('$effect') &&
		!statusNoticeSource.includes('onMount') &&
		!statusNoticeSource.includes('setTimeout') &&
		!statusNoticeSource.includes('Escape') &&
		!statusNoticeSource.includes('IconButton'),
	'StatusNotice dismissal must stay controlled with a native button and no lifecycle, timers, focus or IconButton dependency'
);

requireValue(
	statusNoticeSource.includes('class="giu-status-notice__icon"') &&
		statusNoticeSource.includes('aria-hidden="true"') &&
		statusNoticeSource.includes('class="giu-status-notice__actions"') &&
		statusNoticeSource.indexOf('class="giu-status-notice__actions"') >
			statusNoticeSource.indexOf(
				'class="giu-status-notice__announcement"'
			),
	'StatusNotice icon must be decorative and actions must remain outside the live announcement region'
);

const statusNoticeStyleMatch = statusNoticeSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const statusNoticeStyle = statusNoticeStyleMatch?.[1] ?? '';
const statusNoticeCustomProperties = [
	...statusNoticeStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	statusNoticeCustomProperties.length > 0 &&
		statusNoticeCustomProperties.every((property) =>
			property.startsWith('--giu-status-notice-')
		),
	'StatusNotice must use only neutral --giu-status-notice-* tokens'
);

requireValue(
	[...statusNoticeStyle.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	) &&
		!statusNoticeStyle.includes(':global') &&
		!statusNoticeSource.includes('--studio-') &&
		!statusNoticeSource.includes('--site-'),
	'StatusNotice CSS must remain scoped, neutral and fallback-complete'
);

requireValue(
	socialLinkSource.includes('<a') &&
		socialLinkSource.includes('<SocialIcon') &&
		socialLinkSource.includes('{...sanitizeNativeAttributes(nativeAttributes)}') &&
		socialLinkSource.includes('aria-label={renderState.ariaLabel}') &&
		socialLinkSource.includes("Reflect.deleteProperty(sanitized, 'aria-label')") &&
		socialLinkSource.includes("Reflect.deleteProperty(sanitized, 'aria-labelledby')") &&
		socialLinkContract.includes('HTMLAnchorAttributes') &&
		socialLinkContract.includes('href: string') &&
		socialLinkContract.includes('id: SocialIconId') &&
		socialLinkContract.includes("'aria-label'") &&
		socialLinkContract.includes("'aria-labelledby'"),
	'SocialLink must remain a native anchor composed with SocialIcon and reserve its accessible naming contract'
);

requireValue(
	socialLinkSource.includes('{#if normalizedHref && renderState}') &&
		socialLinkContract.includes('normalizeSocialLinkHref') &&
		socialLinkContract.includes('resolveSocialLinkRenderState') &&
		socialLinkContract.includes('.trim()'),
	'SocialLink invalid href, identifier and icon-only naming states must fail closed'
);

requireValue(
	!socialLinkSource.includes('target="_blank"') &&
		!socialLinkSource.includes("target='_blank'") &&
		!socialLinkSource.includes('rel="') &&
		!socialLinkSource.includes("rel='"),
	'SocialLink must not silently force target or rel navigation policy'
);

const socialLinkCustomProperties = [
	...socialLinkSource.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	socialLinkCustomProperties.length > 0 &&
		socialLinkCustomProperties.every((property) =>
			property.startsWith('--giu-social-link-')
		),
	'SocialLink must use only neutral --giu-social-link-* tokens'
);

requireValue(
	[...socialLinkSource.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'SocialLink custom-property uses must provide fallbacks'
);

requireValue(
	!socialLinkSource.includes(':global') &&
		!socialLinkSource.includes('--studio-') &&
		!socialLinkSource.includes('--site-'),
	'SocialLink CSS must remain scoped and application-neutral'
);

requireValue(
	!asyncOperationPanelSource.includes('<button') &&
		!asyncOperationPanelSource.includes('actionLabel') &&
		!asyncOperationPanelSource.includes('onaction') &&
		!asyncOperationPanelSource.includes('durationMs'),
	'AsyncOperationPanel must compose the required consumer action and persistent status presentation'
);

requireValue(
	asyncOperationPanelContract.includes('action: Snippet') &&
		asyncOperationPanelContract.includes("state: 'running'; busyLabel: string") &&
		asyncOperationPanelContract.includes('progress?: AsyncOperationProgress') &&
		asyncOperationPanelContract.includes('progress?: never') &&
		asyncOperationPanelContract.includes("state: 'success' | 'warning' | 'error'; message: string"),
	'AsyncOperationPanel discriminated state contract is missing required content'
);

requireValue(
	asyncOperationPanelContract.includes('export type AsyncOperationProgress') &&
		asyncOperationPanelSource.includes('<progress') &&
		asyncOperationPanelSource.includes('data-giu-progress={normalizedProgress.mode}') &&
		asyncOperationPanelSource.includes('class="async-operation-panel__progress-bar"') &&
		asyncOperationPanelSource.includes('aria-label={normalizedProgress.label}') &&
		!asyncOperationPanelSource.includes('role="progressbar"') &&
		!asyncOperationPanelSource.includes('aria-valuenow') &&
		!asyncOperationPanelSource.includes('aria-valuemax') &&
		!asyncOperationPanelSource.includes('aria-valuetext') &&
		!asyncOperationPanelSource.includes('aria-live='),
	'AsyncOperationPanel progress must stay native, labeled and non-live'
);

requireValue(
	buttonSource.includes('<button') &&
		buttonSource.includes('{...nativeAttributes}') &&
		buttonContract.includes("HTMLButtonAttributes") &&
		buttonContract.includes("children: Snippet"),
	'Button must remain a native button with required content and public native attribute forwarding'
);

const buttonCustomProperties = [
	...buttonSource.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	buttonCustomProperties.length > 0 &&
		buttonCustomProperties.every((property) => property.startsWith('--giu-button-')),
	'Button must use only neutral --giu-button-* tokens'
);

requireValue(
	!buttonSource.includes(':global') &&
		!buttonSource.includes('--studio-') &&
		!buttonSource.includes('--site-'),
	'Button CSS must remain scoped and application-neutral'
);

requireValue(
	[...buttonSource.matchAll(/var\(([^)]+)\)/g)].every(([, value]) => value.includes(',')),
	'Button custom-property uses must provide fallbacks'
);

requireValue(
	iconButtonSource.includes('<button') &&
		iconButtonSource.includes('{...sanitizeNativeAttributes(nativeAttributes)}') &&
		iconButtonSource.includes('aria-label={normalizedLabel}') &&
		iconButtonSource.includes('aria-hidden="true"') &&
		iconButtonContract.includes('label: string') &&
		iconButtonContract.includes('icon: Snippet') &&
		iconButtonContract.includes("'aria-label'") &&
		iconButtonContract.includes("'aria-labelledby'") &&
		iconButtonSource.includes("Reflect.deleteProperty(sanitized, 'aria-label')") &&
		iconButtonSource.includes("Reflect.deleteProperty(sanitized, 'aria-labelledby')"),
	'IconButton must remain a native icon-only button with a reserved required accessible-name contract'
);

requireValue(
	iconButtonSource.includes('{#if normalizedLabel}') &&
		iconButtonContract.includes('normalizeIconButtonLabel') &&
		iconButtonContract.includes('.trim()'),
	'IconButton invalid runtime labels must fail closed after trimming'
);

const iconButtonCustomProperties = [
	...iconButtonSource.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	iconButtonCustomProperties.length > 0 &&
		iconButtonCustomProperties.every((property) =>
			property.startsWith('--giu-icon-button-')
		),
	'IconButton must use only neutral --giu-icon-button-* tokens'
);

requireValue(
	!iconButtonSource.includes(':global') &&
		!iconButtonSource.includes('--studio-') &&
		!iconButtonSource.includes('--site-'),
	'IconButton CSS must remain scoped and application-neutral'
);

requireValue(
	[...iconButtonSource.matchAll(/var\(([^)]+)\)/g)].every(([, value]) =>
		value.includes(',')
	),
	'IconButton custom-property uses must provide fallbacks'
);

const fieldLabelStyleMatch = fieldLabelSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const fieldLabelStyle = fieldLabelStyleMatch?.[1] ?? '';
const fieldLabelCustomProperties = [
	...fieldLabelStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);
const fieldLabelSelectors = [
	...fieldLabelStyle.matchAll(/([^{}]+)\{/g)
].flatMap(([, selectors]) =>
	selectors.split(',').map((selector) => selector.trim())
);
const expectedFieldLabelCustomProperties = [
	'--giu-field-label-row-gap',
	'--giu-field-label-color',
	'--giu-field-label-weight',
	'--giu-field-label-line-height',
	'--giu-field-label-marker-size',
	'--giu-field-label-marker-weight',
	'--giu-field-label-required-color',
	'--giu-field-label-optional-color',
	'--giu-field-label-hint-gap',
	'--giu-field-label-hint-color',
	'--giu-field-label-hint-size',
	'--giu-field-label-hint-line-height'
];

requireValue(
	fieldLabelContract.includes('label: string') &&
		fieldLabelContract.includes('hint?: string') &&
		fieldLabelContract.includes('required?: boolean') &&
		fieldLabelContract.includes('optional?: boolean') &&
		fieldLabelContract.includes('requiredLabel?: string') &&
		fieldLabelContract.includes('optionalLabel?: string') &&
		fieldLabelContract.includes('hintId?: string') &&
		fieldLabelContract.includes('class?: string') &&
		fieldLabelContract.includes('style?: string'),
	'FieldLabel must expose the closed presentation-only public contract'
);

requireValue(
	fieldLabelSource.includes("'giu-field-label-row'") &&
		fieldLabelSource.includes('`giu-field-label-row--${state}`') &&
		fieldLabelSource.includes('class="giu-field-label"') &&
		fieldLabelSource.includes("'giu-field-label-marker--required'") &&
		fieldLabelSource.includes("'giu-field-label-marker--optional'") &&
		fieldLabelSource.includes('class="giu-field-label-hint"'),
	'FieldLabel must render the documented row, marker and hint presentation'
);

requireValue(
	fieldLabelSource.includes(
		"required ? 'required' : optional ? 'optional' : 'plain'"
	) &&
		fieldLabelSource.includes(
			"state === 'required' && Boolean(requiredLabel?.trim())"
		) &&
		fieldLabelSource.includes(
			"state === 'optional' && Boolean(optionalLabel?.trim())"
		) &&
		fieldLabelSource.includes('Boolean(hint?.trim())') &&
		fieldLabelSource.includes(
			'hasHint && hintId?.trim() ? hintId : undefined'
		),
	'FieldLabel must retain required precedence and omit unresolved marker or hint content'
);

requireValue(
	fieldLabelSource.includes(
		'class="giu-field-label-marker__symbol"'
	) &&
		fieldLabelSource.includes('aria-hidden="true"') &&
		fieldLabelSource.includes(
			'class="giu-field-label-marker__accessible"'
		),
	'FieldLabel required markers must hide the symbol and expose resolved accessible copy'
);

requireValue(
	JSON.stringify(fieldLabelCustomProperties) ===
		JSON.stringify(expectedFieldLabelCustomProperties),
	'FieldLabel must expose exactly the documented --giu-field-label-* tokens'
);

requireValue(
	[...fieldLabelStyle.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'FieldLabel custom-property uses must provide fallbacks'
);

requireValue(
	!fieldLabelStyle.includes(':global') &&
		fieldLabelSelectors.every((selector) =>
			/^\.giu-field-label(?:-(?:row|marker|hint))?(?:__[a-z-]+|--[a-z-]+)?$/.test(
				selector
			)
		) &&
		!fieldLabelSource.includes('--studio-') &&
		!fieldLabelSource.includes('--site-'),
	'FieldLabel CSS must remain scoped and application-neutral'
);

requireValue(
	!/<label(?:\s|>)/i.test(fieldLabelSource) &&
		!/<input(?:\s|>)/i.test(fieldLabelSource) &&
		!/(?:\sfor=|aria-describedby|role=|on(?:click|keydown|keyup|input|change|submit|focus|blur)\s*=|href\s*=|\$effect|onMount)/i.test(
			fieldLabelSource
		) &&
		!fieldLabelSource.includes('{...') &&
		!/\bon[a-z]+\??\s*:/i.test(fieldLabelContract),
	'FieldLabel must not own control association, native validation, events, navigation or lifecycle behavior'
);

requireValue(
	!fieldLabelSource.toLowerCase().includes('atelier') &&
		!fieldLabelContract.toLowerCase().includes('atelier'),
	'FieldLabel must not depend on Atelier-Kit'
);


const fieldDescriptionStyleMatch = fieldDescriptionSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const fieldDescriptionStyle =
	fieldDescriptionStyleMatch?.[1] ?? '';
const fieldDescriptionCustomProperties = [
	...fieldDescriptionStyle.matchAll(
		/var\((--[a-z0-9-]+)/g
	)
].map(([, property]) => property);

requireValue(
	fieldDescriptionContract.includes('text: string') &&
		fieldDescriptionContract.includes('id?: string') &&
		fieldDescriptionContract.includes('class?: string') &&
		fieldDescriptionContract.includes('style?: string') &&
		!fieldDescriptionContract.includes('Snippet'),
	'FieldDescription must expose the minimal text-only public contract'
);

requireValue(
	fieldDescriptionSource.includes('{#if hasText}') &&
		fieldDescriptionSource.includes(
			"typeof text === 'string'"
		) &&
		fieldDescriptionSource.includes(
			'Boolean(text.trim())'
		) &&
		fieldDescriptionSource.includes(
			"typeof id === 'string'"
		) &&
		fieldDescriptionSource.includes('id.trim()') &&
		fieldDescriptionSource.includes('{text}'),
	'FieldDescription must omit whitespace-only content and preserve consumer text/ID ownership'
);

requireValue(
	fieldDescriptionSource.includes('<p') &&
		fieldDescriptionSource.includes(
			"'giu-field-description'"
		) &&
		!fieldDescriptionSource.includes('aria-live') &&
		!fieldDescriptionSource.includes('aria-atomic') &&
		!fieldDescriptionSource.includes('role=') &&
		!fieldDescriptionSource.includes('<label') &&
		!fieldDescriptionSource.includes('<input') &&
		!fieldDescriptionSource.includes(
			'aria-describedby'
		) &&
		!fieldDescriptionSource.includes(
			'aria-errormessage'
		) &&
		!fieldDescriptionSource.includes('aria-invalid'),
	'FieldDescription must remain a static presentation primitive without field-association ownership'
);

requireValue(
	JSON.stringify(fieldDescriptionCustomProperties) ===
		JSON.stringify([
			'--giu-field-description-color',
			'--giu-field-description-size',
			'--giu-field-description-line-height'
		]),
	'FieldDescription must expose exactly the documented neutral custom properties'
);

requireValue(
	[...fieldDescriptionStyle.matchAll(
		/var\(([^)]+)\)/g
	)].every(([, value]) => value.includes(',')) &&
		!fieldDescriptionStyle.includes(':global') &&
		!fieldDescriptionSource.includes('--studio-') &&
		!fieldDescriptionSource.includes('--site-'),
	'FieldDescription CSS must remain scoped, neutral and fallback-complete'
);

const fieldErrorStyleMatch = fieldErrorSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const fieldErrorStyle = fieldErrorStyleMatch?.[1] ?? '';
const fieldErrorCustomProperties = [
	...fieldErrorStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	fieldErrorContract.includes('text: string') &&
		fieldErrorContract.includes('id?: string') &&
		fieldErrorContract.includes('announce?: boolean') &&
		fieldErrorContract.includes('class?: string') &&
		fieldErrorContract.includes('style?: string') &&
		!fieldErrorContract.includes('Snippet'),
	'FieldError must expose the minimal text-only contract with explicit announcement opt-in'
);

requireValue(
	fieldErrorSource.includes('{#if hasText}') &&
		fieldErrorSource.includes(
			"typeof text === 'string'"
		) &&
		fieldErrorSource.includes(
			'Boolean(text.trim())'
		) &&
		fieldErrorSource.includes('announce = false') &&
		fieldErrorSource.includes('announce === true'),
	'FieldError must omit whitespace-only content and default to static presentation'
);

requireValue(
	fieldErrorSource.includes(
		"role={isLive ? 'alert' : undefined}"
	) &&
		fieldErrorSource.includes(
			"aria-live={isLive ? 'assertive' : undefined}"
		) &&
		fieldErrorSource.includes(
			"aria-atomic={isLive ? 'true' : undefined}"
		) &&
		!fieldErrorSource.includes('<label') &&
		!fieldErrorSource.includes('<input') &&
		!fieldErrorSource.includes('aria-describedby') &&
		!fieldErrorSource.includes('aria-errormessage') &&
		!fieldErrorSource.includes('aria-invalid'),
	'FieldError must use assertive alert semantics only through explicit announce opt-in and never own control association'
);

requireValue(
	JSON.stringify(fieldErrorCustomProperties) ===
		JSON.stringify([
			'--giu-field-error-color',
			'--giu-field-error-size',
			'--giu-field-error-line-height'
		]),
	'FieldError must expose exactly the documented neutral custom properties'
);

requireValue(
	[...fieldErrorStyle.matchAll(
		/var\(([^)]+)\)/g
	)].every(([, value]) => value.includes(',')) &&
		!fieldErrorStyle.includes(':global') &&
		!fieldErrorSource.includes('--studio-') &&
		!fieldErrorSource.includes('--site-'),
	'FieldError CSS must remain scoped, neutral and fallback-complete'
);

requireValue(
	!fieldDescriptionSource.toLowerCase().includes(
		'atelier'
	) &&
		!fieldDescriptionContract.toLowerCase().includes(
			'atelier'
		) &&
		!fieldErrorSource.toLowerCase().includes('atelier') &&
		!fieldErrorContract.toLowerCase().includes('atelier'),
	'FieldDescription and FieldError must not depend on Atelier-Kit'
);

const formActionsStyleMatch = formActionsSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const formActionsStyle = formActionsStyleMatch?.[1] ?? '';
const formActionsCustomProperties = [
	...formActionsStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);
const formActionsSelectors = [
	...formActionsStyle.matchAll(/([^{}]+)\{/g)
].flatMap(([, selectors]) =>
	selectors.split(',').map((selector) => selector.trim())
);
const formActionsAlignContract =
	formActionsContract.match(
		/export type FormActionsAlign\s*=([\s\S]*?);/
	)?.[1] ?? '';
const formActionsAlignValues = [
	...formActionsAlignContract.matchAll(/'([^']+)'/g)
].map(([, value]) => value);

requireValue(
	formActionsContract.includes("import type { Snippet } from 'svelte'") &&
		formActionsContract.includes('children: Snippet') &&
		JSON.stringify(formActionsAlignValues) ===
			JSON.stringify(['start', 'center', 'end', 'space-between']),
	'FormActions must require a Snippet and expose the closed alignment contract'
);

requireValue(
	(formActionsSource.match(/<div(?:\s|>)/g) ?? []).length === 1 &&
		formActionsSource.includes("'giu-form-actions'"),
	'FormActions must render one fixed div with the giu-form-actions base class'
);

requireValue(
	formActionsCustomProperties.length === 1 &&
		formActionsCustomProperties[0] === '--giu-form-actions-gap',
	'FormActions must use only the neutral --giu-form-actions-gap token'
);

requireValue(
	/gap:\s*var\(--giu-form-actions-gap,\s*0\.75rem\);/.test(
		formActionsStyle
	),
	'FormActions gap token must retain the documented 0.75rem fallback'
);

requireValue(
	[...formActionsStyle.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'FormActions custom-property uses must provide fallbacks'
);

requireValue(
	!formActionsStyle.includes(':global') &&
		formActionsSelectors.every((selector) =>
			/^\.giu-form-actions(?:--[a-z-]+)?$/.test(selector)
		),
	'FormActions CSS must remain scoped and must not select interactive descendants'
);

requireValue(
	!/(?:role\s*=|aria-|on(?:click|keydown|keyup|input|change|submit|focus|blur)\s*=|href\s*=|\$effect|onMount)/i.test(
		formActionsSource
	) &&
		!/\bon[a-z]+\??\s*:/i.test(formActionsContract),
	'FormActions must not add role, ARIA, event, navigation or lifecycle behavior'
);

requireValue(
	!formActionsSource.toLowerCase().includes('atelier') &&
		!formActionsContract.toLowerCase().includes('atelier'),
	'FormActions must not depend on Atelier-Kit'
);

const editableListRowStyleMatch = editableListRowSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const editableListRowStyle = editableListRowStyleMatch?.[1] ?? '';
const editableListRowCustomProperties = [
	...editableListRowStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	editableListRowContract.includes(
		"export type EditableListRowDropPosition = 'before' | 'after'"
	) &&
		editableListRowContract.includes('export type EditableListRowDragCandidate = {') &&
		editableListRowContract.includes('sourceId: string') &&
		editableListRowContract.includes('targetId: string') &&
		editableListRowContract.includes('position: EditableListRowDropPosition') &&
		editableListRowContract.includes("'pointercancel'") &&
		editableListRowContract.includes("'lostpointercapture'") &&
		editableListRowContract.includes("'escape'") &&
		editableListRowContract.includes('export type EditableListRowDrag = {') &&
		editableListRowContract.includes('id: string') &&
		editableListRowContract.includes('label: string') &&
		editableListRowContract.includes('disabled?: boolean') &&
		editableListRowContract.includes('candidate?: EditableListRowDragCandidate | null') &&
		editableListRowContract.includes('onDragStart?: (sourceId: string) => void') &&
		editableListRowContract.includes('onDragCandidate?: (candidate: EditableListRowDragCandidate | null) => void') &&
		editableListRowContract.includes('onDrop: (candidate: EditableListRowDragCandidate) => void') &&
		editableListRowContract.includes('onDragCancel?: (reason: EditableListRowDragCancelReason) => void') &&
		editableListRowContract.includes('drag?: EditableListRowDrag'),
	'EditableListRow must expose the Studio-only optional pointer-drag contract'
);

requireValue(
	editableListRowSource.includes('resolveValidDrag') &&
		editableListRowSource.includes("typeof value.id !== 'string'") &&
		editableListRowSource.includes("typeof value.label !== 'string'") &&
		editableListRowSource.includes("typeof value.onDrop !== 'function'") &&
		editableListRowSource.includes('value.id.trim() !== value.id') &&
		editableListRowSource.includes('value.label.trim() !== value.label') &&
		editableListRowSource.includes('/\\s/.test(value)') &&
		editableListRowSource.includes('resolveValidCandidate') &&
		editableListRowSource.includes('candidate.sourceId.trim() !== candidate.sourceId') &&
		editableListRowSource.includes('candidate.targetId.trim() !== candidate.targetId') &&
		editableListRowSource.includes('candidate.sourceId === candidate.targetId') &&
		editableListRowSource.includes("validPositions.has(candidate.position)") &&
		editableListRowSource.includes('validCandidate?.sourceId === validDrag.id') &&
		editableListRowSource.includes('validCandidate?.targetId === validDrag.id') &&
		!editableListRowSource.includes('crypto') &&
		!editableListRowSource.includes('Math.random') &&
		!editableListRowSource.includes('Date.now') &&
		!editableListRowSource.includes('document.'),
	'EditableListRow drag config and candidates must validate consumer-owned identity without generated IDs or DOM traversal'
);

requireValue(
	editableListRowSource.includes('<button') &&
		editableListRowSource.includes('type="button"') &&
		editableListRowSource.includes('aria-label={validDrag.label}') &&
		editableListRowSource.includes('disabled={validDrag.disabled}') &&
		editableListRowSource.includes('data-giu-drag-handle') &&
		editableListRowSource.includes('onpointerdown={handlePointerDown}') &&
		editableListRowSource.includes('onpointermove={handlePointerMove}') &&
		editableListRowSource.includes('onpointerup={handlePointerUp}') &&
		editableListRowSource.includes('onpointercancel={handlePointerCancel}') &&
		editableListRowSource.includes('onlostpointercapture={handleLostPointerCapture}') &&
		editableListRowSource.includes('data-giu-dragging={activeGesture ?') &&
		editableListRowSource.includes('data-giu-drop-candidate={dropCandidatePosition}') &&
		editableListRowSource.includes('event.isPrimary') &&
		editableListRowSource.includes("event.pointerType === 'mouse' && event.button !== 0") &&
		editableListRowSource.includes('setPointerCapture') &&
		editableListRowSource.includes('releasePointerCapture') &&
		editableListRowSource.includes('if (activeGesture)') &&
		editableListRowSource.includes("validDrag.onDragStart?.(validDrag.id)") &&
		editableListRowSource.includes('notifyCandidate(sourceCandidate)') &&
		editableListRowSource.includes('drop(candidate)') &&
		editableListRowSource.includes("cancelGesture('pointercancel')") &&
		editableListRowSource.includes("cancelGesture('lostpointercapture')") &&
		editableListRowSource.includes("cancelGesture('escape')") &&
		!editableListRowSource.includes('draggable') &&
		!editableListRowSource.includes('aria-grabbed') &&
		!editableListRowSource.includes('aria-dropeffect') &&
		!editableListRowSource.includes('aria-live') &&
		!editableListRowSource.includes('role='),
	'EditableListRow drag must stay handle-only pointer enhancement without deprecated DnD ARIA or live-region behavior'
);

requireValue(
	editableListRowCustomProperties.length > 0 &&
		editableListRowCustomProperties.every((property) =>
			property.startsWith('--giu-editable-list-row-')
		) &&
		[...editableListRowStyle.matchAll(/var\(([^)]+)\)/g)].every(
			([, value]) => value.includes(',')
		) &&
		editableListRowStyle.includes('touch-action: none') &&
		editableListRowStyle.includes('user-select: none') &&
		!editableListRowStyle.includes(':global') &&
		!editableListRowSource.includes('--studio-') &&
		!editableListRowSource.includes('--site-'),
	'EditableListRow drag CSS must remain scoped, handle-local and --giu-editable-list-row-* only'
);

const reorderActionsStyleMatch = reorderActionsSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const reorderActionsStyle = reorderActionsStyleMatch?.[1] ?? '';
const reorderActionsCustomProperties = [
	...reorderActionsStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	reorderActionsContract.includes('export type ReorderActionsPositionContext = {') &&
		reorderActionsContract.includes('id: string') &&
		reorderActionsContract.includes('text: string') &&
		reorderActionsContract.includes('positionContext?: ReorderActionsPositionContext') &&
		!/\bposition\??:/.test(reorderActionsContract) &&
		!/\btotal\??:/.test(reorderActionsContract),
	'ReorderActions must expose the grouped consumer-owned positionContext contract without numeric position or total props'
);

requireValue(
	reorderActionsSource.includes('validPositionContext') &&
		reorderActionsSource.includes("typeof positionContext.id !== 'string'") &&
		reorderActionsSource.includes("typeof positionContext.text !== 'string'") &&
		reorderActionsSource.includes('!positionContext.id.trim()') &&
		reorderActionsSource.includes('/\\s/.test(positionContext.id)') &&
		reorderActionsSource.includes('!positionContext.text.trim()') &&
		reorderActionsSource.includes('return null') &&
		!reorderActionsSource.includes('crypto') &&
		!reorderActionsSource.includes('Math.random') &&
		!reorderActionsSource.includes('Date.now') &&
		!reorderActionsSource.includes('onMount') &&
		!reorderActionsSource.includes('document.') &&
		!reorderActionsSource.includes('window.'),
	'ReorderActions positionContext must validate consumer-owned strings and avoid generated or browser-derived IDs'
);

requireValue(
	reorderActionsSource.includes('class="giu-reorder-actions__position-context"') &&
		reorderActionsSource.includes('id={validPositionContext.id}') &&
		reorderActionsSource.includes('{validPositionContext.text}') &&
		reorderActionsSource.includes('aria-describedby={validPositionContext?.id}') &&
		(reorderActionsSource.match(/aria-describedby=\{validPositionContext\?\.id\}/g) ?? []).length === 2 &&
		reorderActionsSource.includes('aria-label={moveUpLabel}') &&
		reorderActionsSource.includes('aria-label={moveDownLabel}') &&
		!reorderActionsSource.includes('aria-labelledby') &&
		!reorderActionsSource.includes('aria-live') &&
		!reorderActionsSource.includes('aria-hidden') &&
		!reorderActionsSource.includes('role='),
	'ReorderActions must describe both buttons with one non-live hidden position context while preserving exact labels'
);

requireValue(
	reorderActionsCustomProperties.length > 0 &&
		reorderActionsCustomProperties.every((property) =>
			property.startsWith('--giu-reorder-actions-')
		) &&
		[...reorderActionsStyle.matchAll(/var\(([^)]+)\)/g)].every(
			([, value]) => value.includes(',')
		) &&
		!reorderActionsStyle.includes(':global') &&
		!reorderActionsSource.includes('--studio-') &&
		!reorderActionsSource.includes('--site-'),
	'ReorderActions CSS must remain scoped, neutral and fallback-complete'
);

const reorderAnnouncementStyleMatch = reorderAnnouncementSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const reorderAnnouncementStyle = reorderAnnouncementStyleMatch?.[1] ?? '';
const reorderAnnouncementCustomProperties = [
	...reorderAnnouncementStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	reorderAnnouncementContract.includes(
		'export type ReorderAnnouncementKey = string | number'
	) &&
		reorderAnnouncementContract.includes('message: string | null') &&
		reorderAnnouncementContract.includes(
			'eventKey: ReorderAnnouncementKey | null'
		) &&
		reorderAnnouncementContract.includes('class?: string') &&
		reorderAnnouncementContract.includes('style?: string'),
	'ReorderAnnouncement must expose the required nullable message/eventKey contract'
);

requireValue(
	reorderAnnouncementSource.includes(
		"import { onMount, tick } from 'svelte'"
	) &&
		reorderAnnouncementSource.includes('observedEventKey = eventKey') &&
		reorderAnnouncementSource.includes('nextEventKey === observedEventKey') &&
		reorderAnnouncementSource.includes('renderedMessage =') &&
		reorderAnnouncementSource.includes('announcementVersion') &&
		reorderAnnouncementSource.includes('tick().then'),
	'ReorderAnnouncement must capture the hydration event key and use eventKey-driven retriggering'
);

requireValue(
	reorderAnnouncementSource.includes(
		"class={['giu-reorder-announcement', className]}"
	) &&
		reorderAnnouncementSource.includes('role="status"') &&
		reorderAnnouncementSource.includes('aria-live="polite"') &&
		reorderAnnouncementSource.includes('aria-atomic="true"') &&
		!reorderAnnouncementSource.includes('role="alert"') &&
		!reorderAnnouncementSource.includes('assertive'),
	'ReorderAnnouncement must render one polite status live-region shell'
);

requireValue(
	reorderAnnouncementCustomProperties.length > 0 &&
		reorderAnnouncementCustomProperties.every((property) =>
			property.startsWith('--giu-reorder-announcement-')
		) &&
		[...reorderAnnouncementStyle.matchAll(/var\(([^)]+)\)/g)].every(
			([, value]) => value.includes(',')
		) &&
		!reorderAnnouncementStyle.includes(':global') &&
		!reorderAnnouncementSource.includes('--studio-') &&
		!reorderAnnouncementSource.includes('--site-'),
	'ReorderAnnouncement CSS must remain scoped, neutral and fallback-complete'
);

requireValue(
	!reorderAnnouncementSource.includes('FormStatus') &&
		!reorderAnnouncementSource.includes('StatusNotice') &&
		!reorderAnnouncementSource.includes('Date.now') &&
		!reorderAnnouncementSource.toLowerCase().includes('atelier') &&
		!reorderAnnouncementContract.toLowerCase().includes('atelier'),
	'ReorderAnnouncement must stay isolated from other feedback primitives, clocks and Atelier-Kit'
);


const panelStyleMatch = panelSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const panelStyle = panelStyleMatch?.[1] ?? '';
const panelCustomProperties = [
	...panelStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);
const panelHeadingContract =
	panelContract.match(
		/export type PanelHeadingLevel\s*=([\s\S]*?);/
	)?.[1] ?? '';
const panelHeadingValues = [
	...panelHeadingContract.matchAll(/\b([2-6])\b/g)
].map(([, value]) => Number(value));

requireValue(
	panelContract.includes("import type { Snippet } from 'svelte'") &&
		panelContract.includes('title: string') &&
		panelContract.includes('description?: Snippet') &&
		panelContract.includes('actions?: Snippet') &&
		panelContract.includes('children: Snippet') &&
		JSON.stringify(panelHeadingValues) ===
			JSON.stringify([2, 3, 4, 5, 6]),
	'Panel must require title and children and expose the closed heading-level contract'
);

requireValue(
	panelSource.includes('<section') &&
		panelSource.includes("class={['giu-panel', className]}") &&
		panelSource.includes('aria-labelledby={titleId}') &&
		panelSource.includes('<header class="giu-panel__header">') &&
		panelSource.includes('class="giu-panel__title"') &&
		panelSource.includes('class="giu-panel__body"'),
	'Panel must render the named semantic section, header, heading and body structure'
);

requireValue(
	panelSource.includes('const generatedId = $props.id()') &&
		panelSource.includes('const panelId = $derived(id ?? generatedId)') &&
		panelSource.includes("const titleId = $derived(`${panelId}-title`)") &&
		panelSource.includes('normalizePanelHeadingLevel(headingLevel)'),
	'Panel must provide deterministic IDs and normalize runtime heading levels'
);

requireValue(
	panelCustomProperties.length > 0 &&
		panelCustomProperties.every((property) =>
			property.startsWith('--giu-panel-')
		),
	'Panel must use only neutral --giu-panel-* tokens'
);

requireValue(
	!panelStyle.includes(':global') &&
		!panelSource.includes('--studio-') &&
		!panelSource.includes('--site-'),
	'Panel CSS must remain scoped and application-neutral'
);

requireValue(
	[...panelStyle.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'Panel custom-property uses must provide fallbacks'
);

requireValue(
	!panelSource.includes('aria-live') &&
		!panelSource.includes('aria-busy') &&
		!panelSource.includes('role=') &&
		!/\bon(?:click|keydown|keyup|input|change|submit|focus|blur)\s*=/.test(
			panelSource
		) &&
		!panelSource.includes('$effect') &&
		!panelSource.includes('onMount'),
	'Panel must not own live regions, async state, events, focus or lifecycle behavior'
);

requireValue(
	!panelSource.toLowerCase().includes('atelier') &&
		!panelContract.toLowerCase().includes('atelier'),
	'Panel must not depend on Atelier-Kit'
);


const surfaceStyleMatch = surfaceSource.match(
	/<style>([\s\S]*?)<\/style>/
);
const surfaceStyle = surfaceStyleMatch?.[1] ?? '';
const surfaceCustomProperties = [
	...surfaceStyle.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);
const surfaceSelectors = [
	...surfaceStyle.matchAll(/([^{}]+)\{/g)
].flatMap(([, selectors]) =>
	selectors.split(',').map((selector) => selector.trim())
);
const expectedSurfaceCustomProperties = [
	'--giu-surface-padding',
	'--giu-surface-border-width',
	'--giu-surface-border-color',
	'--giu-surface-border-radius',
	'--giu-surface-color',
	'--giu-surface-background'
];

requireValue(
	surfaceContract.includes("import type { Snippet } from 'svelte'") &&
		surfaceContract.includes('children: Snippet') &&
		surfaceContract.includes('class?: string') &&
		surfaceContract.includes('style?: string'),
	'Surface must require a Snippet and expose only class and style customization'
);

requireValue(
	(surfaceSource.match(/<div(?:\s|>)/g) ?? []).length === 1 &&
		surfaceSource.includes("class={['giu-surface', className]}") &&
		surfaceSource.includes('{@render children()}'),
	'Surface must render one fixed neutral div with the giu-surface base class'
);

requireValue(
	JSON.stringify(surfaceCustomProperties) ===
		JSON.stringify(expectedSurfaceCustomProperties),
	'Surface must expose exactly the documented --giu-surface-* tokens'
);

requireValue(
	/padding:\s*var\(--giu-surface-padding,\s*1rem\);/.test(surfaceStyle) &&
		/border:\s*var\(--giu-surface-border-width,\s*1px\)\s*solid\s*var\(--giu-surface-border-color,\s*#767676\);/.test(
			surfaceStyle
		) &&
		/border-radius:\s*var\(--giu-surface-border-radius,\s*0\.5rem\);/.test(
			surfaceStyle
		) &&
		/color:\s*var\(--giu-surface-color,\s*#202020\);/.test(surfaceStyle) &&
		/background:\s*var\(--giu-surface-background,\s*#ffffff\);/.test(
			surfaceStyle
		),
	'Surface tokens must retain their documented neutral fallbacks'
);

requireValue(
	[...surfaceStyle.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'Surface custom-property uses must provide fallbacks'
);

requireValue(
	!surfaceStyle.includes(':global') &&
		surfaceSelectors.every((selector) => selector === '.giu-surface') &&
		!surfaceSource.includes('--studio-') &&
		!surfaceSource.includes('--site-'),
	'Surface CSS must remain scoped, root-only and application-neutral'
);

requireValue(
	!/(?:role\s*=|aria-|on(?:click|keydown|keyup|input|change|submit|focus|blur)\s*=|href\s*=|\$effect|onMount|<section(?:\s|>)|<header(?:\s|>)|<h[1-6](?:\s|>))/i.test(
		surfaceSource
	) &&
		!surfaceSource.includes('{...') &&
		!/\bon[a-z]+\??\s*:/i.test(surfaceContract),
	'Surface must not add semantics, attribute forwarding, events, navigation or lifecycle behavior'
);

requireValue(
	!surfaceSource.toLowerCase().includes('atelier') &&
		!surfaceContract.toLowerCase().includes('atelier'),
	'Surface must not depend on Atelier-Kit'
);

requireValue(
	manifest.version === '0.1.0',
	'unexpected package version'
);

requireValue(
	manifest.private === true,
	'private must be true'
);

requireValue(
	manifest.license === 'MIT',
	'license must be MIT'
);

requireValue(
	manifest.engines?.node === '^20.19.0 || >=22.12.0',
	'unexpected Node.js engine contract'
);

requireValue(
	manifest.engines?.node === '^20.19.0 || >=22.12.0',
	'unexpected Node.js engine contract'
);

requireValue(
	!Object.hasOwn(manifest, 'publishConfig'),
	'publishConfig is forbidden'
);

requireValue(
	!manifest.dependencies?.svelte,
	'Svelte must not be a runtime dependency'
);

requireValue(
	!manifest.dependencies?.['@sveltejs/kit'],
	'SvelteKit must not be a runtime dependency'
);

requireValue(
	[
		'dependencies',
		'devDependencies',
		'peerDependencies',
		'optionalDependencies'
	].every((field) =>
		!Object.keys(manifest[field] ?? {}).some((name) =>
			name.includes('atelier-kit')
		)
	),
	'Atelier-Kit must not be a package dependency'
);

const formStatusCustomProperties = [
	...formStatusSource.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	formStatusCustomProperties.length > 0 &&
		formStatusCustomProperties.every((property) =>
			property.startsWith('--giu-form-status-')
		),
	'FormStatus must use only neutral --giu-form-status-* tokens'
);

requireValue(
	!formStatusSource.includes(':global') &&
		!formStatusSource.includes('--studio-') &&
		!formStatusSource.includes('--site-'),
	'FormStatus CSS must remain scoped and application-neutral'
);

requireValue(
	[...formStatusSource.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'FormStatus custom-property uses must provide fallbacks'
);

const asyncOperationPanelCustomProperties = [
	...asyncOperationPanelSource.matchAll(/var\((--[a-z0-9-]+)/g)
].map(([, property]) => property);

requireValue(
	asyncOperationPanelCustomProperties.length > 0 &&
		asyncOperationPanelCustomProperties.every((property) =>
			property.startsWith('--giu-async-operation-panel-')
		),
	'AsyncOperationPanel must use only --giu-async-operation-panel-* tokens'
);

requireValue(
	!asyncOperationPanelSource.includes(':global') &&
		!asyncOperationPanelSource.includes('--studio-') &&
		!asyncOperationPanelSource.includes('--site-'),
	'AsyncOperationPanel CSS must remain scoped and application-neutral'
);

requireValue(
	[...asyncOperationPanelSource.matchAll(/var\(([^)]+)\)/g)].every(
		([, value]) => value.includes(',')
	),
	'AsyncOperationPanel custom-property uses must provide fallbacks'
);

requireValue(
	typeof manifest.peerDependencies?.svelte === 'string',
	'Svelte peer dependency is required'
);

requireValue(
	typeof manifest.devDependencies?.svelte === 'string',
	'Svelte development dependency is required'
);

requireValue(
	!manifest.scripts?.publish,
	'publish script is forbidden'
);

requireValue(
	manifest.scripts?.prepublishOnly === 'node scripts/refuse-publish.mjs',
	'prepublishOnly must refuse publication'
);

requireValue(
	manifest.scripts?.test ===
		'npm run test:ssr && npm run test:browser',
	'test must run SSR and browser gates'
);

requireValue(
	manifest.scripts?.['verify:graphs'] ===
		'node scripts/verify-entry-graphs.mjs',
	'entry-graph verification must remain enabled'
);

requireValue(
	manifest.scripts?.['verify:publication'] ===
		'node scripts/verify-publication-block.mjs',
	'publication-block verification must remain enabled'
);

requireValue(
	manifest.scripts?.validate?.includes(
		'npm run verify:pack'
	),
	'validate must include packed-consumer verification'
);

const expectedExports = [
	'.',
	'./visitor',
	'./studio',
	'./styles.css',
	'./visitor/styles.css',
	'./studio/styles.css'
];

requireValue(
	JSON.stringify(Object.keys(manifest.exports ?? {})) ===
		JSON.stringify(expectedExports),
	'export map does not match the approved contract'
);

for (const entry of ['.', './visitor', './studio']) {
	const conditions = manifest.exports?.[entry];

	requireValue(
		conditions &&
			typeof conditions.types === 'string' &&
			typeof conditions.svelte === 'string' &&
			typeof conditions.default === 'string',
		`${entry} must expose types, svelte and default conditions`
	);
}

if (errors.length > 0) {
	console.error('Manifest verification failed:');

	for (const error of errors) {
		console.error(`- ${error}`);
	}

	process.exit(1);
}

console.log('Manifest verification passed.');
