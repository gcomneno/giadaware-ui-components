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
const formActionsSource = await readFile(
	new URL('../src/lib/studio/FormActions.svelte', import.meta.url),
	'utf8'
);
const formActionsContract = await readFile(
	new URL('../src/lib/studio/form-actions.ts', import.meta.url),
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
	!asyncOperationPanelSource.includes('<button') &&
		!asyncOperationPanelSource.includes('actionLabel') &&
		!asyncOperationPanelSource.includes('onaction') &&
		!asyncOperationPanelSource.includes('durationMs'),
	'AsyncOperationPanel must compose the required consumer action and persistent status presentation'
);

requireValue(
	asyncOperationPanelContract.includes('action: Snippet') &&
		asyncOperationPanelContract.includes("state: 'running'; busyLabel: string") &&
		asyncOperationPanelContract.includes("state: 'success' | 'warning' | 'error'; message: string"),
	'AsyncOperationPanel discriminated state contract is missing required content'
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
	manifest.version === '0.0.0',
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
