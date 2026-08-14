import { createHash } from 'node:crypto';
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporaryRoot = await mkdtemp(join(tmpdir(), 'giu-pack-'));
const packDirectory = join(temporaryRoot, 'pack');
const consumerDirectory = join(temporaryRoot, 'consumer');

function run(command, args, cwd, inherit = false) {
	const result = spawnSync(command, args, {
		cwd,
		encoding: 'utf8',
		// npm pack's file manifest can exceed spawnSync's default 1 MiB buffer.
		maxBuffer: 10 * 1024 * 1024,
		stdio: inherit ? 'inherit' : 'pipe',
		env: {
			...process.env,
			npm_config_cache: join(temporaryRoot, 'npm-cache')
		}
	});

	if (result.status !== 0) {
		if (!inherit) {
			if (result.stdout) {
				process.stderr.write(result.stdout);
			}

			if (result.stderr) {
				process.stderr.write(result.stderr);
			}
		}

		throw new Error(`${command} ${args.join(' ')} failed`);
	}

	return result;
}

try {
	await mkdir(packDirectory, { recursive: true });
	await mkdir(consumerDirectory, { recursive: true });

	const packed = run(
		'npm',
		[
			'pack',
			'--json',
			'--ignore-scripts',
			'--pack-destination',
			packDirectory
		],
		root
	);

	// npm 10 may print the local prepare lifecycle before its JSON payload even
	// with --ignore-scripts. The JSON array starts on its own line.
	const packedOutput = packed.stdout.includes('[\n')
		? packed.stdout
		: packed.stderr;
	const jsonStart = packedOutput.indexOf('[\n');
	const jsonPayload = jsonStart === -1
		? packedOutput
		: packedOutput.slice(jsonStart);
	let metadata;

	try {
		metadata = JSON.parse(jsonPayload);
	} catch (error) {
		throw new Error(
			`npm pack returned invalid JSON (stdout ${packed.stdout.length}, stderr ${packed.stderr.length}): ${error.message}`
		);
	}

	if (!Array.isArray(metadata) || metadata.length !== 1) {
		throw new Error('npm pack returned unexpected metadata');
	}

	const artifact = metadata[0];
	const paths = artifact.files
		.map((file) => file.path)
		.sort();

	const expectedPaths = [
		'CHANGELOG.md',
		'LICENSE',
		'README.md',
		'THIRD_PARTY_NOTICES.md',
		'dist/FormStatus.svelte',
		'dist/FormStatus.svelte.d.ts',
		'dist/SocialIcon.svelte',
		'dist/SocialIcon.svelte.d.ts',
		'dist/form-status.d.ts',
		'dist/form-status.js',
		'dist/index.d.ts',
		'dist/index.js',
		'dist/internal/FormStatusPresentation.svelte',
		'dist/internal/FormStatusPresentation.svelte.d.ts',
		'dist/internal/form-status.d.ts',
		'dist/internal/form-status.js',
		'dist/social-icon-paths.d.ts',
		'dist/social-icon-paths.js',
		'dist/social-icon-runtime.d.ts',
		'dist/social-icon-runtime.js',
		'dist/social-icon.d.ts',
		'dist/social-icon.js',
		'dist/social-icons/facebook.d.ts',
		'dist/social-icons/facebook.js',
		'dist/social-icons/github-sponsors.d.ts',
		'dist/social-icons/github-sponsors.js',
		'dist/social-icons/github.d.ts',
		'dist/social-icons/github.js',
		'dist/social-icons/instagram.d.ts',
		'dist/social-icons/instagram.js',
		'dist/social-icons/x.d.ts',
		'dist/social-icons/x.js',
		'dist/studio/AsyncOperationPanel.svelte',
		'dist/studio/AsyncOperationPanel.svelte.d.ts',
		'dist/studio/Button.svelte',
		'dist/studio/Button.svelte.d.ts',
		'dist/studio/EditableList.svelte',
		'dist/studio/EditableList.svelte.d.ts',
		'dist/studio/EditableListRow.svelte',
		'dist/studio/EditableListRow.svelte.d.ts',
		'dist/studio/FieldLabel.svelte',
		'dist/studio/FieldLabel.svelte.d.ts',
		'dist/studio/FormActions.svelte',
		'dist/studio/FormActions.svelte.d.ts',
		'dist/studio/IconButton.svelte',
		'dist/studio/IconButton.svelte.d.ts',
		'dist/studio/ImageAttachmentControl.svelte',
		'dist/studio/ImageAttachmentControl.svelte.d.ts',
		'dist/studio/PageIntro.svelte',
		'dist/studio/PageIntro.svelte.d.ts',
		'dist/studio/Panel.svelte',
		'dist/studio/Panel.svelte.d.ts',
		'dist/studio/ReorderActions.svelte',
		'dist/studio/ReorderActions.svelte.d.ts',
		'dist/studio/Surface.svelte',
		'dist/studio/Surface.svelte.d.ts',
		'dist/studio/async-operation-panel.d.ts',
		'dist/studio/async-operation-panel.js',
		'dist/studio/button.d.ts',
		'dist/studio/button.js',
		'dist/studio/editable-list-row.d.ts',
		'dist/studio/editable-list-row.js',
		'dist/studio/editable-list.d.ts',
		'dist/studio/editable-list.js',
		'dist/studio/field-label.d.ts',
		'dist/studio/field-label.js',
		'dist/studio/form-actions.d.ts',
		'dist/studio/form-actions.js',
		'dist/studio/icon-button.d.ts',
		'dist/studio/icon-button.js',
		'dist/studio/image-attachment-control.d.ts',
		'dist/studio/image-attachment-control.js',
		'dist/studio/index.d.ts',
		'dist/studio/index.js',
		'dist/studio/page-intro.d.ts',
		'dist/studio/page-intro.js',
		'dist/studio/panel.d.ts',
		'dist/studio/panel.js',
		'dist/studio/reorder-actions.d.ts',
		'dist/studio/reorder-actions.js',
		'dist/studio/styles.css',
		'dist/studio/surface.d.ts',
		'dist/studio/surface.js',
		'dist/styles.css',
		'dist/visitor/ImageLightbox.svelte',
		'dist/visitor/ImageLightbox.svelte.d.ts',
		'dist/visitor/RelationshipGraph.svelte',
		'dist/visitor/RelationshipGraph.svelte.d.ts',
		'dist/visitor/image-lightbox.d.ts',
		'dist/visitor/image-lightbox.js',
		'dist/visitor/index.d.ts',
		'dist/visitor/index.js',
		'dist/visitor/relationship-graph.d.ts',
		'dist/visitor/relationship-graph.js',
		'dist/visitor/styles.css',
		'package.json'
	];

	if (JSON.stringify(paths) !== JSON.stringify(expectedPaths)) {
		console.error('Packed-file allowlist mismatch.');
		console.error('Expected:');
		console.error(expectedPaths.join('\n'));
		console.error('Actual:');
		console.error(paths.join('\n'));
		process.exit(1);
	}

	const tarball = join(packDirectory, artifact.filename);
	const sha256 = createHash('sha256')
		.update(await readFile(tarball))
		.digest('hex');

	const rootManifest = JSON.parse(
		await readFile(join(root, 'package.json'), 'utf8')
	);

	await writeFile(
		join(consumerDirectory, 'package.json'),
		JSON.stringify(
			{
				private: true,
				type: 'module',
				dependencies: {
					'giadaware-ui-components': `file:${tarball}`,
					svelte: rootManifest.devDependencies.svelte
				},
				devDependencies: {
					'@sveltejs/vite-plugin-svelte':
						rootManifest.devDependencies[
							'@sveltejs/vite-plugin-svelte'
						],
					vite: rootManifest.devDependencies.vite
				}
			},
			null,
			2
		) + '\n'
	);

	await writeFile(
		join(consumerDirectory, 'EditableListConsumer.svelte'),
		[
			'<script lang="ts">',
			"\timport { EditableList, EditableListRow, ReorderActions } from 'giadaware-ui-components/studio';",
			'</script>',
			'',
			'{#snippet empty()}<p>No images yet.</p>{/snippet}',
			'{#snippet fields()}<label>Hero image <input name="hero" /></label>{/snippet}',
			'{#snippet actions()}',
			'\t<ReorderActions',
			'\t\tmoveUpLabel="Move hero image up"',
			'\t\tmoveDownLabel="Move hero image down"',
			'\t\tcanMoveUp={false}',
			'\t\tonMoveUp={() => {}}',
			'\t\tonMoveDown={() => {}}',
			'\t/>',
			'{/snippet}',
			'',
			'<EditableList legend="Gallery" isEmpty={false} {empty}>',
			'\t<EditableListRow position={1} {fields} {actions} />',
			'</EditableList>',
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'index.mjs'),
		[
			"import { createRawSnippet } from 'svelte';",
			"import { render } from 'svelte/server';",
			"import EditableListConsumer from './EditableListConsumer.svelte';",
			"const root = await import('giadaware-ui-components');",
			"const visitor = await import('giadaware-ui-components/visitor');",
			"const studio = await import('giadaware-ui-components/studio');",
			'',
			"if (typeof root.FormStatus !== 'function') {",
			"\tthrow new Error('FormStatus runtime export is missing.');",
			'}',
			'',
			"if (typeof root.SocialIcon !== 'function') {",
			"\tthrow new Error('SocialIcon runtime export is missing.');",
			'}',
			'',
			"const expectedIds = ['instagram', 'facebook', 'x', 'github', 'github-sponsors'];",
			'',
			"if (JSON.stringify(root.SOCIAL_ICON_IDS) !== JSON.stringify(expectedIds)) {",
			"\tthrow new Error('SOCIAL_ICON_IDS runtime export is incorrect.');",
			'}',
			'',
			"const expectedRootKeys = ['FormStatus', 'SOCIAL_ICON_IDS', 'SocialIcon'].sort();",
			"const expectedStudioKeys = ['AsyncOperationPanel', 'Button', 'EditableList', 'EditableListRow', 'FieldLabel', 'FormActions', 'IconButton', 'ImageAttachmentControl', 'PageIntro', 'Panel', 'ReorderActions', 'Surface'].sort();",
			'',
			'if (JSON.stringify(Object.keys(root).sort()) !== JSON.stringify(expectedRootKeys)) {',
			"\tthrow new Error('Root runtime exports are incorrect.');",
			'}',
			'',
			"if (JSON.stringify(Object.keys(visitor).sort()) !== JSON.stringify(['ImageLightbox', 'RelationshipGraph'])) {",
			"\tthrow new Error('Visitor runtime exports are incorrect.');",
			'}',
			'',
			"if (typeof visitor.ImageLightbox !== 'function') {",
			"\tthrow new Error('ImageLightbox runtime export is missing.');",
			'}',
			'',
			"const imageLightboxActions = createRawSnippet(() => ({ render: () => '<button type=\"button\">Packed action</button>' }));",
			'const imageLightboxMarkup = render(visitor.ImageLightbox, {',
			'\tprops: {',
			'\t\topen: false,',
			'\t\tonopenchange: () => {},',
			"\t\tsrc: '/packed-image.jpg',",
			"\t\talt: 'Packed image',",
			"\t\tlabels: { dialog: 'Packed image preview', close: 'Close packed image' },",
			'\t\tactions: imageLightboxActions',
			'\t}',
			'}).body;',
			'',
			"if (!imageLightboxMarkup.includes('<dialog') || !imageLightboxMarkup.includes('Packed image preview') || !imageLightboxMarkup.includes('Packed image') || !imageLightboxMarkup.includes('Packed action')) {",
			"\tthrow new Error('ImageLightbox packed-consumer SSR rendering is incorrect.');",
			'}',
			'',
			'if (JSON.stringify(Object.keys(studio).sort()) !== JSON.stringify(expectedStudioKeys)) {',
			"\tthrow new Error('Studio runtime exports are incorrect.');",
			'}',
			'',
			"if (typeof studio.ImageAttachmentControl !== 'function') {",
			"\tthrow new Error('ImageAttachmentControl runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.AsyncOperationPanel !== 'function') {",
			"\tthrow new Error('AsyncOperationPanel runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.Button !== 'function') {",
			"\tthrow new Error('Button runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.IconButton !== 'function') {",
			"\tthrow new Error('IconButton runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.EditableList !== 'function' || typeof studio.EditableListRow !== 'function' || typeof studio.ReorderActions !== 'function') {",
			"\tthrow new Error('Editable-list runtime exports are missing.');",
			'}',
			'',
			"if (typeof studio.FieldLabel !== 'function') {",
			"\tthrow new Error('FieldLabel runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.FormActions !== 'function') {",
			"\tthrow new Error('FormActions runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.PageIntro !== 'function') {",
			"\tthrow new Error('PageIntro runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.Panel !== 'function') {",
			"\tthrow new Error('Panel runtime export is missing.');",
			'}',
			'',
			"if (typeof studio.Surface !== 'function') {",
			"\tthrow new Error('Surface runtime export is missing.');",
			'}',
			'',
			"const prohibitedHelpers = ['createImageAttachmentState', 'selectImageAttachmentFile', 'cancelImageAttachmentReplacement', 'chooseImageAttachmentRemoval', 'cancelImageAttachmentRemoval', 'normalizeImageAttachmentState', 'validateImageAttachmentFile', 'normalizeFormActionsAlign', 'normalizePanelHeadingLevel', 'normalizeEditableListPosition', 'normalizeReorderActionsSize', 'normalizeIconButtonLabel'];",
			'if (prohibitedHelpers.some((name) => name in studio)) {',
			"\tthrow new Error('Studio runtime unexpectedly exposes an internal helper.');",
			'}',
			'',
			'const editableListMarkup = render(EditableListConsumer).body;',
			'const requiredEditableListMarkup = [',
			"\t'<fieldset',",
			"\t'<legend',",
			"\t'Gallery',",
			"\t'<ol',",
			"\t'<li',",
			"\t'aria-label=\"Move hero image up\"',",
			"\t'aria-label=\"Move hero image down\"',",
			"\t'disabled=\"\"'",
			'];',
			'',
			'if (',
			'\trequiredEditableListMarkup.some((fragment) => !editableListMarkup.includes(fragment)) ||',
			"\teditableListMarkup.includes('No images yet.') ||",
			'\t(editableListMarkup.match(/type="button"/g) ?? []).length !== 2',
			') {',
			"\tthrow new Error('Packed EditableList composition server render is incorrect.');",
			'}',
			'',
			"console.log('Clean consumer runtime imports passed.');",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'production-invalid-id.mjs'),
		[
			"import { createRawSnippet } from 'svelte';",
			"import { render } from 'svelte/server';",
			"import { SocialIcon } from 'giadaware-ui-components';",
			"import { IconButton } from 'giadaware-ui-components/studio';",
			'',
			'const warnings = [];',
			'const originalWarn = console.warn;',
			'',
			'console.warn = (...args) => {',
			'\twarnings.push(args);',
			'};',
			'',
			'try {',
			'\tconst invalidIdResult = render(SocialIcon, {',
			"\t\tprops: { id: 'invalid-production-id' }",
			'\t});',
			'',
			"\tif (invalidIdResult.body.includes('<svg')) {",
			"\t\tthrow new Error('Invalid production ID rendered an SVG.');",
			'\t}',
			'',
			'\tconst missingLabelResult = render(SocialIcon, {',
			"\t\tprops: { id: 'github', decorative: false }",
			'\t});',
			'',
			"\tif (missingLabelResult.body.includes('<svg')) {",
			"\t\tthrow new Error('Missing production ariaLabel rendered an SVG.');",
			'\t}',
			'',
			"\tconst icon = createRawSnippet(() => ({ render: () => '<span>Icon</span>' }));",
			'\tconst validIconButtonResult = render(IconButton, {',
			"\t\tprops: { label: 'Edit item', icon, 'aria-label': 'Runtime override', 'aria-labelledby': 'runtime-name' }",
			'\t});',
			'',
			"\tif (!validIconButtonResult.body.includes('<button') ||",
			"\t\t!validIconButtonResult.body.includes('aria-label=\\\"Edit item\\\"') ||",
			"\t\tvalidIconButtonResult.body.includes('aria-label=\\\"Runtime override\\\"') ||",
			"\t\tvalidIconButtonResult.body.includes('aria-labelledby=') ||",
			"\t\t!validIconButtonResult.body.includes('aria-hidden=\\\"true\\\"')) {",
			"\t\tthrow new Error('Valid production IconButton packed rendering is incorrect.');",
			'\t}',
			'',
			'\tconst blankIconButtonResult = render(IconButton, {',
			"\t\tprops: { label: '   ', icon }",
			'\t});',
			'',
			"\tif (blankIconButtonResult.body.includes('<button')) {",
			"\t\tthrow new Error('Blank production IconButton label rendered a button.');",
			'\t}',
			'',
			'\tif (warnings.length !== 0) {',
			"\t\tthrow new Error('Invalid production props emitted a warning.');",
			'\t}',
			'} finally {',
			'\tconsole.warn = originalWarn;',
			'}',
			'',
			"console.log('Production invalid-props behavior passed.');",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'vite.production-invalid.config.mjs'),
		[
			"import { svelte } from '@sveltejs/vite-plugin-svelte';",
			"import { defineConfig } from 'vite';",
			'',
			'export default defineConfig({',
			'\tplugins: [svelte()],',
			'\tbuild: {',
			"\t\tssr: 'production-invalid-id.mjs',",
			"\t\toutDir: 'dist-production-invalid',",
			'\t\temptyOutDir: true,',
			'\t\trollupOptions: {',
			'\t\t\toutput: {',
			"\t\t\t\tentryFileNames: 'production-invalid.mjs'",
			'\t\t\t}',
			'\t\t}',
			'\t},',
			'\tssr: {',
			"\t\tnoExternal: ['giadaware-ui-components']",
			'\t}',
			'});',
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'registry-only.mjs'),
		[
			"import { SOCIAL_ICON_IDS } from 'giadaware-ui-components';",
			'',
			"const expectedIds = ['instagram', 'facebook', 'x', 'github', 'github-sponsors'];",
			'',
			'if (JSON.stringify(SOCIAL_ICON_IDS) !== JSON.stringify(expectedIds)) {',
			"\tthrow new Error('Registry-only consumer received incorrect IDs.');",
			'}',
			'',
			"console.log('Registry-only consumer passed.');",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'vite.registry.config.mjs'),
		[
			"import { writeFile } from 'node:fs/promises';",
			"import { svelte } from '@sveltejs/vite-plugin-svelte';",
			"import { defineConfig } from 'vite';",
			'',
			"const moduleManifest = new URL('./registry-modules.json', import.meta.url);",
			'',
			'const recordChunkModules = {',
			"\tname: 'record-chunk-modules',",
			'\tasync generateBundle(_options, bundle) {',
			'\t\tconst modules = Object.values(bundle)',
			"\t\t\t.filter((output) => output.type === 'chunk')",
			'\t\t\t.flatMap((chunk) => Object.keys(chunk.modules));',
			'',
			'\t\tawait writeFile(',
			'\t\t\tmoduleManifest,',
			"\t\t\tJSON.stringify([...new Set(modules)].sort(), null, 2) + '\\n'",
			'\t\t);',
			'\t}',
			'};',
			'',
			'export default defineConfig({',
			'\tplugins: [svelte(), recordChunkModules],',
			'\tbuild: {',
			"\t\tssr: 'registry-only.mjs',",
			"\t\toutDir: 'dist-registry',",
			'\t\temptyOutDir: true,',
			'\t\trollupOptions: {',
			'\t\t\toutput: {',
			"\t\t\t\tentryFileNames: 'registry.mjs'",
			'\t\t\t}',
			'\t\t}',
			'\t},',
			'\tssr: {',
			"\t\tnoExternal: ['giadaware-ui-components']",
			'\t}',
			'});',
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'vite.config.mjs'),
		[
			"import { svelte } from '@sveltejs/vite-plugin-svelte';",
			"import { defineConfig } from 'vite';",
			'',
			'export default defineConfig({',
			'\tplugins: [svelte()],',
			'\tbuild: {',
			"\t\tssr: 'index.mjs',",
			"\t\toutDir: 'dist-ssr',",
			'\t\temptyOutDir: true,',
			'\t\trollupOptions: {',
			'\t\t\toutput: {',
			"\t\t\t\tentryFileNames: '[name].mjs'",
			'\t\t\t}',
			'\t\t}',
			'\t},',
			'\tssr: {',
			"\t\tnoExternal: ['giadaware-ui-components']",
			'\t}',
			'});',
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'verify-svelte.mjs'),
		[
			"import { realpath } from 'node:fs/promises';",
			"import { createRequire } from 'node:module';",
			'',
			'const consumerRequire = createRequire(import.meta.url);',
			'const packageRequire = createRequire(',
			"\tnew URL('./node_modules/giadaware-ui-components/package.json', import.meta.url)",
			');',
			'',
			"const consumerResolution = await realpath(consumerRequire.resolve('svelte'));",
			"const packageResolution = await realpath(packageRequire.resolve('svelte'));",
			'',
			'if (consumerResolution !== packageResolution) {',
			"\tthrow new Error('Package and consumer resolve different Svelte runtimes.');",
			'}',
			'',
			'console.log(',
			'\tJSON.stringify(',
			'\t\t{ consumerResolution, packageResolution },',
			'\t\tnull,',
			'\t\t2',
			'\t)',
			');',
			"console.log('Single Svelte runtime resolution passed.');",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'index.ts'),
		[
			"import { FormStatus, SOCIAL_ICON_IDS, SocialIcon } from 'giadaware-ui-components';",
			"import type { FormStatusTone, SocialIconId } from 'giadaware-ui-components';",
			"import type { ComponentProps, Snippet } from 'svelte';",
			"import { ImageLightbox } from 'giadaware-ui-components/visitor';",
			"import type { ImageLightboxLabels, ImageLightboxProps } from 'giadaware-ui-components/visitor';",
			"import { AsyncOperationPanel, Button, EditableList, EditableListRow, FieldLabel, FormActions, IconButton, ImageAttachmentControl, PageIntro, Panel, ReorderActions, Surface } from 'giadaware-ui-components/studio';",
			"import type { AsyncOperationPanelProps, AsyncOperationState, ButtonProps, ButtonSize, ButtonVariant, EditableListProps, EditableListRowProps, FieldLabelProps, FormActionsAlign, FormActionsProps, IconButtonProps, ImageAttachmentControlLabels, ImageAttachmentCurrentImage, ImageAttachmentDropzoneOptions, ImageAttachmentFileValidator, ImageAttachmentIntent, ImageAttachmentState, ImageAttachmentValidationError, PageIntroProps, PanelHeadingLevel, PanelProps, ReorderActionsProps, ReorderActionsSize, SurfaceProps } from 'giadaware-ui-components/studio';",
			'',
			"const id: SocialIconId = 'github-sponsors';",
			"const tone: FormStatusTone = 'warning';",
			"const imageLightboxLabels: ImageLightboxLabels = { dialog: 'Packed preview', close: 'Close preview' };",
			'declare const imageLightboxActions: Snippet;',
			"const imageLightboxProps: ImageLightboxProps = { open: false, onopenchange: (open) => { void open; }, src: '/packed.jpg', alt: 'Packed image', labels: imageLightboxLabels, actions: imageLightboxActions };",
			"const imageLightboxComponentProps: ComponentProps<typeof ImageLightbox> = imageLightboxProps;",
			'void imageLightboxComponentProps;',

			'const formStatusProps: ComponentProps<typeof FormStatus> = {',
			"\tmessage: 'Review required',",
			'\ttone,',
			'\tdurationMs: null',
			'};',
			'',
			"// @ts-expect-error FormStatusTone is a closed union.",
			"const invalidTone: FormStatusTone = 'neutral';",
			'',
			'const informativeProps: ComponentProps<typeof SocialIcon> = {',
			"\tid: 'github',",
			'\tdecorative: false,',
			"\tariaLabel: 'GitHub profile'",
			'};',
			'',
			'// @ts-expect-error Informative icons require ariaLabel.',
			'const missingInformativeLabel: ComponentProps<typeof SocialIcon> = {',
			"\tid: 'github',",
			'\tdecorative: false',
			'};',
			'',
			"const attachmentIntent: ImageAttachmentIntent = 'keep';",
			"const attachmentState: ImageAttachmentState = { intent: attachmentIntent, file: null };",
			"const attachmentImage: ImageAttachmentCurrentImage = { src: '/image.png', alt: 'Current image' };",
			"const attachmentLabels: ImageAttachmentControlLabels = { input: 'Choose image', cancelReplacement: 'Cancel replacement', remove: 'Remove image', cancelRemoval: 'Cancel removal', keepExistingStatus: 'Existing image kept', keepEmptyStatus: 'No image selected', replaceStatus: 'Replacement selected', removeStatus: 'Image will be removed', replacementPreviewAlt: 'Replacement preview' };",
			"const attachmentDropzone: ImageAttachmentDropzoneOptions = { instructions: 'Drop image', activeInstructions: 'Release image' };",
			"const attachmentError: ImageAttachmentValidationError = { code: 'custom', message: 'Invalid image' };",
			'const attachmentValidator: ImageAttachmentFileValidator = (file) => file.size === 0 ? attachmentError : null;',
			'const attachmentRequiredProps: ComponentProps<typeof ImageAttachmentControl> = { value: attachmentState, onvaluechange: (value: ImageAttachmentState) => { void value; }, invalidTypeMessage: \'Wrong type\', tooLargeMessage: \'Too large\', labels: attachmentLabels };',
			'const attachmentCompleteProps: ComponentProps<typeof ImageAttachmentControl> = { ...attachmentRequiredProps, currentImage: attachmentImage, disabled: false, dropzone: attachmentDropzone, accept: \'image/*\', maxSizeBytes: 1000000, validator: attachmentValidator, name: \'image\', id: \'image-input\', class: \'attachment\', style: \'max-width: 20rem\' };',
			'declare const operationAction: Snippet;',
			"const operationState: AsyncOperationState = 'running';",
			"const operationProps: AsyncOperationPanelProps = { state: operationState, title: 'Build', action: operationAction, busyLabel: 'Build running' };",
			'const operationComponentProps: ComponentProps<typeof AsyncOperationPanel> = { ...operationProps, technicalDetails: \'Build output\', technicalDetailsLabel: \'Technical details\', technicalDetailsInitiallyExpanded: false, headingLevel: 3, class: \'operation\', style: \'max-width: 30rem\' };',
			'declare const buttonChildren: Snippet;',
			'declare const buttonLeading: Snippet;',
			'declare const buttonTrailing: Snippet;',
			"const buttonVariant: ButtonVariant = 'danger';",
			"const buttonSize: ButtonSize = 'compact';",
			"const buttonProps: ButtonProps = { children: buttonChildren, leading: buttonLeading, trailing: buttonTrailing, variant: buttonVariant, size: buttonSize, type: 'submit', name: 'intent', value: 'remove', 'aria-label': 'Remove item', 'data-testid': 'remove', onclick: (event) => event.currentTarget.focus() };",
			'const buttonComponentProps: ComponentProps<typeof Button> = buttonProps;',
			'declare const iconButtonIcon: Snippet;',
			"const iconButtonProps: IconButtonProps = { label: 'Edit item', icon: iconButtonIcon, variant: buttonVariant, size: buttonSize, type: 'button', disabled: false, 'aria-describedby': 'edit-help', 'aria-pressed': false, onclick: (event) => event.currentTarget.focus() };",
			'const iconButtonComponentProps: ComponentProps<typeof IconButton> = iconButtonProps;',
			"const fieldLabelProps: FieldLabelProps = { label: 'Email', hint: 'Used for notifications', required: true, optional: false, requiredLabel: 'Required', optionalLabel: 'Optional', hintId: 'email-hint', class: 'field-label', style: '--giu-field-label-row-gap: 0.5rem' };",
			'const fieldLabelComponentProps: ComponentProps<typeof FieldLabel> = fieldLabelProps;',
			'declare const formActionsChildren: Snippet;',
			"const formActionsAlign: FormActionsAlign = 'space-between';",
			"const formActionsProps: FormActionsProps = { children: formActionsChildren, align: formActionsAlign, wrap: false, class: 'actions', style: '--giu-form-actions-gap: 1rem' };",
			'const formActionsComponentProps: ComponentProps<typeof FormActions> = formActionsProps;',
			'declare const listChildren: Snippet;',
			'declare const rowFields: Snippet;',
			'const editableListProps: EditableListProps = { legend: \'Gallery\', children: listChildren, isEmpty: false };',
			'const editableListRowProps: EditableListRowProps = { position: 1, fields: rowFields };',
			"const reorderSize: ReorderActionsSize = 'compact';",
			"const reorderActionsProps: ReorderActionsProps = { moveUpLabel: 'Move up', moveDownLabel: 'Move down', onMoveUp: () => {}, onMoveDown: () => {}, size: reorderSize };",
			'const editableListComponentProps: ComponentProps<typeof EditableList> = editableListProps;',
			'const editableListRowComponentProps: ComponentProps<typeof EditableListRow> = editableListRowProps;',
			'const reorderActionsComponentProps: ComponentProps<typeof ReorderActions> = reorderActionsProps;',
			'declare const pageIntroChildren: Snippet;',
			"const pageIntroProps: PageIntroProps = { children: pageIntroChildren, class: 'intro', style: '--giu-page-intro-margin: 0' };",
			'const pageIntroComponentProps: ComponentProps<typeof PageIntro> = pageIntroProps;',
			'declare const panelChildren: Snippet;',
			'declare const panelDescription: Snippet;',
			'declare const panelActions: Snippet;',
			'declare const panelFooter: Snippet;',
			'const panelHeadingLevel: PanelHeadingLevel = 4;',
			"const panelProps: PanelProps = { title: 'Settings', children: panelChildren, description: panelDescription, actions: panelActions, footer: panelFooter, headingLevel: panelHeadingLevel, id: 'settings-panel', class: 'panel', style: '--giu-panel-gap: 1.5rem' };",
			'const panelComponentProps: ComponentProps<typeof Panel> = panelProps;',
			'declare const surfaceChildren: Snippet;',
			"const surfaceProps: SurfaceProps = { children: surfaceChildren, class: 'surface', style: '--giu-surface-padding: 2rem' };",
			'const surfaceComponentProps: ComponentProps<typeof Surface> = surfaceProps;',
			'// @ts-expect-error Panel title is required.',
			"const missingPanelTitle: PanelProps = { children: panelChildren };",
			'// @ts-expect-error Panel children are required.',
			"const missingPanelChildren: PanelProps = { title: 'Settings' };",
			'// @ts-expect-error Surface children are required.',
			'const missingSurfaceChildren: SurfaceProps = {};',
			'// @ts-expect-error Surface does not expose arbitrary div attributes.',
			"const unsupportedSurfaceRole: SurfaceProps = { children: surfaceChildren, role: 'region' };",
			'// @ts-expect-error PanelHeadingLevel is closed.',
			'const invalidPanelHeadingLevel: PanelHeadingLevel = 1;',
			'// @ts-expect-error Panel does not expose arbitrary section attributes.',
			"const unsupportedPanelRole: PanelProps = { title: 'Settings', children: panelChildren, role: 'region' };",
			'// @ts-expect-error PageIntro children are required.',
			'const missingPageIntroChildren: PageIntroProps = {};',
			'// @ts-expect-error PageIntro does not expose arbitrary paragraph attributes.',
			"const unsupportedPageIntroRole: PageIntroProps = { children: pageIntroChildren, role: 'note' };",
			'// @ts-expect-error FormActions children are required.',
			'const missingFormActionsChildren: FormActionsProps = {};',
			'// @ts-expect-error FormActionsAlign is closed.',
			"const invalidFormActionsAlign: FormActionsAlign = 'distributed';",
			'// @ts-expect-error FormActions wrap must be boolean.',
			"const invalidFormActionsWrap: FormActionsProps = { children: formActionsChildren, wrap: 'yes' };",
			'// @ts-expect-error FormActions does not expose arbitrary div attributes.',
			"const unsupportedFormActionsRole: FormActionsProps = { children: formActionsChildren, role: 'group' };",
			'// @ts-expect-error FieldLabel label is required.',
			'const missingFieldLabelLabel: FieldLabelProps = {};',
			'// @ts-expect-error FieldLabel does not expose control-association attributes.',
			"const unsupportedFieldLabelFor: FieldLabelProps = { label: 'Email', for: 'email' };",
			'// @ts-expect-error Button children are required.',
			'const missingButtonChildren: ButtonProps = { type: \'button\' };',
			'// @ts-expect-error IconButton label is required.',
			'const missingIconButtonLabel: IconButtonProps = { icon: iconButtonIcon };',
			'// @ts-expect-error IconButton icon is required.',
			"const missingIconButtonIcon: IconButtonProps = { label: 'Edit item' };",
			'// @ts-expect-error IconButton reserves aria-label for its label prop.',
			"const unsupportedIconButtonAriaLabel: IconButtonProps = { label: 'Edit item', icon: iconButtonIcon, 'aria-label': 'Override' };",
			'// @ts-expect-error IconButton reserves aria-labelledby for its label prop.',
			"const unsupportedIconButtonAriaLabelledby: IconButtonProps = { label: 'Edit item', icon: iconButtonIcon, 'aria-labelledby': 'other-name' };",
			'// @ts-expect-error ButtonVariant is closed.',
			"const invalidButtonVariant: ButtonVariant = 'quiet';",
			'// @ts-expect-error Native button type is closed.',
			"const invalidButtonType: ButtonProps = { children: buttonChildren, type: 'link' };",
			'// @ts-expect-error Running requires busyLabel.',
			"const missingBusyLabel: AsyncOperationPanelProps = { state: 'running', title: 'Build', action: operationAction };",
			"// @ts-expect-error AsyncOperationState is closed.",
			"const invalidOperationState: AsyncOperationState = 'complete';",
			"// @ts-expect-error Dropzone instructions are required.",
			"const invalidAttachmentDropzone: ImageAttachmentDropzoneOptions = { activeInstructions: 'Release image' };",
			"// @ts-expect-error ImageAttachmentIntent is closed.",
			"const invalidAttachmentIntent: ImageAttachmentIntent = 'archive';",
			'// @ts-expect-error Required ImageAttachmentControl props are missing.',
			'const missingAttachmentProps: ComponentProps<typeof ImageAttachmentControl> = { value: attachmentState };',
			'// @ts-expect-error Internal helpers are not Studio exports.',
			"import { createImageAttachmentState } from 'giadaware-ui-components/studio';",
			'// @ts-expect-error Panel normalization helper is not a Studio export.',
			"import { normalizePanelHeadingLevel } from 'giadaware-ui-components/studio';",
			'',
			'void id;',
			'void tone;',
			'void formStatusProps;',
			'void invalidTone;',
			'void informativeProps;',
			'void missingInformativeLabel;',
			'void SOCIAL_ICON_IDS;',
			'void FormStatus;',
			'void SocialIcon;',
			'void attachmentCompleteProps;',
			'void invalidAttachmentDropzone;',
			'void operationComponentProps;',
			'void buttonComponentProps;',
			'void iconButtonComponentProps;',
			'void fieldLabelComponentProps;',
			'void formActionsComponentProps;',
			'void editableListComponentProps;',
			'void editableListRowComponentProps;',
			'void reorderActionsComponentProps;',
			'void pageIntroComponentProps;',
			'void panelComponentProps;',
			'void surfaceComponentProps;',
			'void missingPanelTitle;',
			'void missingPanelChildren;',
			'void missingSurfaceChildren;',
			'void unsupportedSurfaceRole;',
			'void invalidPanelHeadingLevel;',
			'void unsupportedPanelRole;',
			'void missingPageIntroChildren;',
			'void unsupportedPageIntroRole;',
			'void missingFormActionsChildren;',
			'void invalidFormActionsAlign;',
			'void invalidFormActionsWrap;',
			'void unsupportedFormActionsRole;',
			'void missingFieldLabelLabel;',
			'void unsupportedFieldLabelFor;',
			'void missingButtonChildren;',
			'void missingIconButtonLabel;',
			'void missingIconButtonIcon;',
			'void unsupportedIconButtonAriaLabel;',
			'void unsupportedIconButtonAriaLabelledby;',
			'void invalidButtonVariant;',
			'void invalidButtonType;',
			'void invalidOperationState;',
			'void invalidAttachmentIntent;',
			'void missingAttachmentProps;',
			'void createImageAttachmentState;',
			'void normalizePanelHeadingLevel;',
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'tsconfig.json'),
		JSON.stringify(
			{
				compilerOptions: {
					module: 'ESNext',
					moduleResolution: 'Bundler',
					allowArbitraryExtensions: true,
					strict: true,
					skipLibCheck: true,
					noEmit: true
				},
				include: ['index.ts']
			},
			null,
			2
		) + '\n'
	);

	await writeFile(
		join(consumerDirectory, 'nodenext.ts'),
		[
			"import { FormStatus } from 'giadaware-ui-components';",
			"import type { FormStatusTone } from 'giadaware-ui-components';",
			"import { AsyncOperationPanel, Button, FieldLabel, FormActions, IconButton, ImageAttachmentControl, PageIntro, Panel, Surface } from 'giadaware-ui-components/studio';",
			"import type { AsyncOperationPanelProps, AsyncOperationState, ButtonProps, ButtonVariant, FieldLabelProps, FormActionsAlign, FormActionsProps, IconButtonProps, ImageAttachmentControlLabels, ImageAttachmentDropzoneOptions, ImageAttachmentIntent, ImageAttachmentState, PageIntroProps, PanelHeadingLevel, PanelProps, SurfaceProps } from 'giadaware-ui-components/studio';",
			"import type { ComponentProps, Snippet } from 'svelte';",
			"import { ImageLightbox } from 'giadaware-ui-components/visitor';",
			"import type { ImageLightboxLabels, ImageLightboxProps } from 'giadaware-ui-components/visitor';",
			'',
			"const tone: FormStatusTone = 'success';",
			"const imageLightboxLabels: ImageLightboxLabels = { dialog: 'Packed preview', close: 'Close preview' };",
			'declare const imageLightboxActions: Snippet;',
			"const imageLightboxProps: ImageLightboxProps = { open: false, onopenchange: (open) => { void open; }, src: '/packed.jpg', alt: 'Packed image', labels: imageLightboxLabels, actions: imageLightboxActions };",
			"const imageLightboxComponentProps: ComponentProps<typeof ImageLightbox> = imageLightboxProps;",
			'void imageLightboxComponentProps;',

			'// @ts-expect-error FormStatusTone is a closed union.',
			"const invalidTone: FormStatusTone = 'neutral';",
			'',
			"const attachmentState: ImageAttachmentState = { intent: 'keep', file: null };",
			"const attachmentLabels: ImageAttachmentControlLabels = { input: 'Choose image', cancelReplacement: 'Cancel replacement', remove: 'Remove image', cancelRemoval: 'Cancel removal', keepExistingStatus: 'Existing image kept', keepEmptyStatus: 'No image selected', replaceStatus: 'Replacement selected', removeStatus: 'Image will be removed', replacementPreviewAlt: 'Replacement preview' };",
			"const attachmentDropzone: ImageAttachmentDropzoneOptions = { instructions: 'Drop image' };",
			'const attachmentProps: ComponentProps<typeof ImageAttachmentControl> = { value: attachmentState, onvaluechange: (value: ImageAttachmentState) => { void value; }, dropzone: attachmentDropzone, invalidTypeMessage: \'Wrong type\', tooLargeMessage: \'Too large\', labels: attachmentLabels };',
			'declare const operationAction: Snippet;',
			"const operationState: AsyncOperationState = 'success';",
			"const operationProps: AsyncOperationPanelProps = { state: operationState, title: 'Publish', action: operationAction, message: 'Published' };",
			'const operationComponentProps: ComponentProps<typeof AsyncOperationPanel> = operationProps;',
			'declare const buttonChildren: Snippet;',
			'declare const buttonLeading: Snippet;',
			'declare const buttonTrailing: Snippet;',
			"const buttonVariant: ButtonVariant = 'primary';",
			"const buttonProps: ButtonProps = { children: buttonChildren, leading: buttonLeading, trailing: buttonTrailing, variant: buttonVariant, type: 'button', disabled: false, onclick: (event) => event.currentTarget.focus() };",
			'const buttonComponentProps: ComponentProps<typeof Button> = buttonProps;',
			'declare const iconButtonIcon: Snippet;',
			"const iconButtonProps: IconButtonProps = { label: 'Publish options', icon: iconButtonIcon, variant: buttonVariant, type: 'button', disabled: false, 'aria-expanded': false };",
			'const iconButtonComponentProps: ComponentProps<typeof IconButton> = iconButtonProps;',
			"const fieldLabelProps: FieldLabelProps = { label: 'Email', hint: 'Used for notifications', required: true, optional: false, requiredLabel: 'Required', optionalLabel: 'Optional', hintId: 'email-hint', class: 'field-label', style: '--giu-field-label-row-gap: 0.5rem' };",
			'const fieldLabelComponentProps: ComponentProps<typeof FieldLabel> = fieldLabelProps;',
			'declare const formActionsChildren: Snippet;',
			"const formActionsAlign: FormActionsAlign = 'center';",
			'const formActionsProps: FormActionsProps = { children: formActionsChildren, align: formActionsAlign, wrap: true };',
			'const formActionsComponentProps: ComponentProps<typeof FormActions> = formActionsProps;',
			'declare const pageIntroChildren: Snippet;',
			'const pageIntroProps: PageIntroProps = { children: pageIntroChildren };',
			'const pageIntroComponentProps: ComponentProps<typeof PageIntro> = pageIntroProps;',
			'declare const panelChildren: Snippet;',
			'declare const panelFooter: Snippet;',
			'const panelHeadingLevel: PanelHeadingLevel = 3;',
			"const panelProps: PanelProps = { title: 'Settings', children: panelChildren, footer: panelFooter, headingLevel: panelHeadingLevel };",
			'const panelComponentProps: ComponentProps<typeof Panel> = panelProps;',
			'declare const surfaceChildren: Snippet;',
			"const surfaceProps: SurfaceProps = { children: surfaceChildren, class: 'surface', style: '--giu-surface-padding: 2rem' };",
			'const surfaceComponentProps: ComponentProps<typeof Surface> = surfaceProps;',
			'// @ts-expect-error Panel title is required.',
			"const missingPanelTitle: PanelProps = { children: panelChildren };",
			'// @ts-expect-error Panel children are required.',
			"const missingPanelChildren: PanelProps = { title: 'Settings' };",
			'// @ts-expect-error Surface children are required.',
			'const missingSurfaceChildren: SurfaceProps = {};',
			'// @ts-expect-error Surface does not expose arbitrary div attributes.',
			"const unsupportedSurfaceRole: SurfaceProps = { children: surfaceChildren, role: 'region' };",
			'// @ts-expect-error PanelHeadingLevel is closed.',
			'const invalidPanelHeadingLevel: PanelHeadingLevel = 1;',
			'// @ts-expect-error PageIntro children are required.',
			'const missingPageIntroChildren: PageIntroProps = {};',
			'// @ts-expect-error FormActions children are required.',
			'const missingFormActionsChildren: FormActionsProps = {};',
			'// @ts-expect-error FormActionsAlign is closed.',
			"const invalidFormActionsAlign: FormActionsAlign = 'distributed';",
			'// @ts-expect-error FormActions does not expose arbitrary div attributes.',
			"const unsupportedFormActionsRole: FormActionsProps = { children: formActionsChildren, role: 'group' };",
			'// @ts-expect-error FieldLabel label is required.',
			'const missingFieldLabelLabel: FieldLabelProps = {};',
			'// @ts-expect-error FieldLabel does not expose control-association attributes.',
			"const unsupportedFieldLabelFor: FieldLabelProps = { label: 'Email', for: 'email' };",
			'// @ts-expect-error ImageAttachmentIntent is closed.',
			"const invalidAttachmentIntent: ImageAttachmentIntent = 'archive';",
			'// @ts-expect-error Required ImageAttachmentControl props are missing.',
			'const missingAttachmentProps: ComponentProps<typeof ImageAttachmentControl> = { value: attachmentState };',
			'// @ts-expect-error Internal helpers are not Studio exports.',
			"import { createImageAttachmentState } from 'giadaware-ui-components/studio';",
			'// @ts-expect-error Panel normalization helper is not a Studio export.',
			"import { normalizePanelHeadingLevel } from 'giadaware-ui-components/studio';",
			'',
			'void tone;',
			'void invalidTone;',
			'void FormStatus;',
			'void attachmentProps;',
			'void operationComponentProps;',
			'void buttonComponentProps;',
			'void iconButtonComponentProps;',
			'void fieldLabelComponentProps;',
			'void formActionsComponentProps;',
			'void pageIntroComponentProps;',
			'void panelComponentProps;',
			'void surfaceComponentProps;',
			'void missingPanelTitle;',
			'void missingPanelChildren;',
			'void missingSurfaceChildren;',
			'void unsupportedSurfaceRole;',
			'void invalidPanelHeadingLevel;',
			'void missingPageIntroChildren;',
			'void missingFormActionsChildren;',
			'void invalidFormActionsAlign;',
			'void unsupportedFormActionsRole;',
			'void missingFieldLabelLabel;',
			'void unsupportedFieldLabelFor;',
			'void invalidAttachmentIntent;',
			'void missingAttachmentProps;',
			'void createImageAttachmentState;',
			'void normalizePanelHeadingLevel;',
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'tsconfig.nodenext.json'),
		JSON.stringify(
			{
				compilerOptions: {
					module: 'NodeNext',
					moduleResolution: 'NodeNext',
					strict: true,
					skipLibCheck: true,
					noEmit: true
				},
				include: ['nodenext.ts']
			},
			null,
			2
		) + '\n'
	);

	run(
		'npm',
		[
			'install',
			'--ignore-scripts',
			'--no-audit',
			'--no-fund'
		],
		consumerDirectory,
		true
	);

	const dependencyTreeResult = run(
		'npm',
		['ls', 'svelte', '--json', '--all'],
		consumerDirectory
	);

	const dependencyTree = JSON.parse(
		dependencyTreeResult.stdout
	);

	const svelteVersions = new Set();

	function collectSvelteVersions(node) {
		const svelte = node?.dependencies?.svelte;

		if (svelte?.version) {
			svelteVersions.add(svelte.version);
		}

		for (
			const dependency of
			Object.values(node?.dependencies ?? {})
		) {
			collectSvelteVersions(dependency);
		}
	}

	collectSvelteVersions(dependencyTree);

	if (svelteVersions.size !== 1) {
		throw new Error(
			`Expected one Svelte version, found: ${
				[...svelteVersions].join(', ') || 'none'
			}`
		);
	}

	console.log(
		`Single Svelte version in consumer tree: ${
			[...svelteVersions][0]
		}`
	);

	run(
		process.execPath,
		['verify-svelte.mjs'],
		consumerDirectory,
		true
	);

	run(
		process.execPath,
		[
			join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
			'--project',
			join(consumerDirectory, 'tsconfig.nodenext.json')
		],
		consumerDirectory,
		true
	);

	run(
		process.execPath,
		[
			join(
				consumerDirectory,
				'node_modules',
				'vite',
				'bin',
				'vite.js'
			),
			'build',
			'--config',
			'vite.production-invalid.config.mjs'
		],
		consumerDirectory,
		true
	);

	run(
		process.execPath,
		[
			join(
				'dist-production-invalid',
				'production-invalid.mjs'
			)
		],
		consumerDirectory,
		true
	);

	run(
		process.execPath,
		[
			join(
				consumerDirectory,
				'node_modules',
				'vite',
				'bin',
				'vite.js'
			),
			'build',
			'--config',
			'vite.registry.config.mjs'
		],
		consumerDirectory,
		true
	);

	const registryBundle = await readFile(
		join(
			consumerDirectory,
			'dist-registry',
			'registry.mjs'
		),
		'utf8'
	);
	const registryModules = JSON.parse(
		await readFile(
			join(consumerDirectory, 'registry-modules.json'),
			'utf8'
		)
	).map((moduleId) => moduleId.replaceAll('\\', '/'));

	const forbiddenRegistryModules = [
		'/dist/SocialIcon.svelte',
		'/dist/social-icon-runtime.js',
		'/dist/social-icon-paths.js',
		'/dist/social-icons/'
	];

	for (const forbiddenModule of forbiddenRegistryModules) {
		if (
			registryModules.some((moduleId) =>
				moduleId.includes(forbiddenModule)
			)
		) {
			throw new Error(
				`Registry-only chunks unexpectedly include a SocialIcon module: ${forbiddenModule}`
			);
		}
	}

	if (
		!registryModules.some((moduleId) =>
			moduleId.includes('/dist/social-icon.js')
		)
	) {
		throw new Error(
			'Registry-only chunks do not include dist/social-icon.js.'
		);
	}

	const forbiddenRegistryBundleFragments = [
		'M7.0301.084c-1.2768',
		'M9.101 23.691v-7.98',
		'M14.234 10.162 22.977',
		'M12 .297c-6.63',
		'M14 20.408c-.492.308',
		'SocialIcon received the unsupported id',
		'no non-empty ariaLabel'
	];

	for (const fragment of forbiddenRegistryBundleFragments) {
		if (registryBundle.includes(fragment)) {
			throw new Error(
				`Registry-only bundle unexpectedly contains SocialIcon geometry or runtime code: ${fragment}`
			);
		}
	}

	run(
		process.execPath,
		[join('dist-registry', 'registry.mjs')],
		consumerDirectory,
		true
	);

	console.log(
		'Registry-only Vite SSR tree-shaking passed: chunk modules exclude SocialIcon geometry and runtime code.'
	);

	run(
		process.execPath,
		[
			join(
				consumerDirectory,
				'node_modules',
				'vite',
				'bin',
				'vite.js'
			),
			'build',
			'--config',
			'vite.config.mjs'
		],
		consumerDirectory,
		true
	);

	run(
		process.execPath,
		[join('dist-ssr', 'index.mjs')],
		consumerDirectory,
		true
	);

	run(
		process.execPath,
		[
			join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
			'--project',
			join(consumerDirectory, 'tsconfig.json')
		],
		consumerDirectory,
		true
	);

	for (const cssPath of [
		'THIRD_PARTY_NOTICES.md',
		'dist/styles.css',
		'dist/visitor/styles.css',
		'dist/studio/styles.css'
	]) {
		await access(
			join(
				consumerDirectory,
				'node_modules',
				'giadaware-ui-components',
				cssPath
			)
		);
	}

	const sourceCommit = run(
		'git',
		['rev-parse', 'HEAD'],
		root
	).stdout.trim();

	const sourceTreeState =
		run(
			'git',
			[
				'status',
				'--porcelain',
				'--untracked-files=all'
			],
			root
		).stdout.trim() === ''
			? 'clean'
			: 'dirty';

	console.log(
		JSON.stringify(
			{
				sourceCommit,
				sourceTreeState,
				filename: artifact.filename,
				sha256,
				files: paths
			},
			null,
			2
		)
	);

	console.log('Packed artifact verification passed.');
} finally {
	await rm(temporaryRoot, {
		recursive: true,
		force: true
	});
}
