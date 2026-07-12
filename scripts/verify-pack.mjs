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
		'dist/index.d.ts',
		'dist/index.js',
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
				}
			},
			null,
			2
		) + '\n'
	);

	await writeFile(
		join(consumerDirectory, 'index.mjs'),
		[
			"await import('giadaware-ui-components');",
			"await import('giadaware-ui-components/visitor');",
			"await import('giadaware-ui-components/studio');",
			"console.log('Clean consumer runtime imports passed.');",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'index.ts'),
		[
			"import 'giadaware-ui-components';",
			"import 'giadaware-ui-components/visitor';",
			"import 'giadaware-ui-components/studio';",
			''
		].join('\n')
	);

	await writeFile(
		join(consumerDirectory, 'tsconfig.json'),
		JSON.stringify(
			{
				compilerOptions: {
					module: 'NodeNext',
					moduleResolution: 'NodeNext',
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

	run(
		process.execPath,
		['index.mjs'],
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

	console.log(
		JSON.stringify(
			{
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
