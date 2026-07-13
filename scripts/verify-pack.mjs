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
		stdio: inherit ? 'inherit' : 'pipe'
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

	const metadata = JSON.parse(packed.stdout);

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
		'dist/studio/index.d.ts',
		'dist/studio/index.js',
		'dist/studio/styles.css',
		'dist/styles.css',
		'dist/visitor/index.d.ts',
		'dist/visitor/index.js',
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
		join(consumerDirectory, 'index.mjs'),
		[
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
			'if (Object.keys(visitor).length !== 0 || Object.keys(studio).length !== 0) {',
			"\tthrow new Error('Visitor and Studio runtime exports must remain empty.');",
			'}',
			'',
			"console.log('Clean consumer runtime imports passed.');",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'production-invalid-id.mjs'),
		[
			"import { render } from 'svelte/server';",
			"import { SocialIcon } from 'giadaware-ui-components';",
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
			"import type { ComponentProps } from 'svelte';",
			"import 'giadaware-ui-components/visitor';",
			"import 'giadaware-ui-components/studio';",
			'',
			"const id: SocialIconId = 'github-sponsors';",
			"const tone: FormStatusTone = 'warning';",
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
			'void id;',
			'void tone;',
			'void formStatusProps;',
			'void invalidTone;',
			'void informativeProps;',
			'void missingInformativeLabel;',
			'void SOCIAL_ICON_IDS;',
			'void FormStatus;',
			'void SocialIcon;',
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
			"import 'giadaware-ui-components/visitor';",
			"import 'giadaware-ui-components/studio';",
			'',
			"const tone: FormStatusTone = 'success';",
			'// @ts-expect-error FormStatusTone is a closed union.',
			"const invalidTone: FormStatusTone = 'neutral';",
			'',
			'void tone;',
			'void invalidTone;',
			'void FormStatus;',
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
