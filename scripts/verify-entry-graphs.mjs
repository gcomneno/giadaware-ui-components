import {
	existsSync,
	readFileSync,
	readdirSync,
	statSync
} from 'node:fs';
import {
	dirname,
	extname,
	join,
	relative,
	resolve,
	sep
} from 'node:path';
import ts from 'typescript';

const repositoryRoot = resolve(
	new URL('..', import.meta.url).pathname
);

const sourceRoot = join(repositoryRoot, 'src', 'lib');
const distRoot = join(repositoryRoot, 'dist');

const errors = [];

function normalize(path) {
	return path.split(sep).join('/');
}

function fail(message) {
	errors.push(message);
}

function collectFiles(directory, extensions) {
	if (!existsSync(directory)) {
		return [];
	}

	const files = [];

	for (const entry of readdirSync(directory)) {
		const path = join(directory, entry);
		const stat = statSync(path);

		if (stat.isDirectory()) {
			files.push(...collectFiles(path, extensions));
			continue;
		}

		if (extensions.has(extname(path))) {
			files.push(path);
		}
	}

	return files;
}

function graphFor(path, root) {
	const local = normalize(relative(root, path));

	if (
		local === 'internal' ||
		local.startsWith('internal/')
	) {
		return 'internal';
	}

	if (
		local === 'visitor' ||
		local.startsWith('visitor/')
	) {
		return 'visitor';
	}

	if (
		local === 'studio' ||
		local.startsWith('studio/')
	) {
		return 'studio';
	}

	return 'root';
}

const allowedDependencies = {
	root: new Set(['root', 'internal']),
	visitor: new Set(['visitor', 'internal']),
	studio: new Set(['studio', 'internal']),
	internal: new Set(['internal'])
};

function parseModuleSpecifiers(code, filename) {
	const source = ts.createSourceFile(
		filename,
		code,
		ts.ScriptTarget.Latest,
		true,
		filename.endsWith('.js')
			? ts.ScriptKind.JS
			: ts.ScriptKind.TS
	);

	const specifiers = [];

	function visit(node) {
		if (
			(ts.isImportDeclaration(node) ||
				ts.isExportDeclaration(node)) &&
			node.moduleSpecifier &&
			ts.isStringLiteral(node.moduleSpecifier)
		) {
			specifiers.push(node.moduleSpecifier.text);
		}

		if (
			ts.isCallExpression(node) &&
			node.expression.kind ===
				ts.SyntaxKind.ImportKeyword &&
			node.arguments.length === 1 &&
			ts.isStringLiteral(node.arguments[0])
		) {
			specifiers.push(node.arguments[0].text);
		}

		ts.forEachChild(node, visit);
	}

	visit(source);

	return specifiers;
}

function scriptsFromSvelte(code) {
	const scripts = [];
	const pattern =
		/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g;

	for (const match of code.matchAll(pattern)) {
		scripts.push(match[1]);
	}

	return scripts;
}

function moduleSpecifiers(path) {
	const code = readFileSync(path, 'utf8');

	if (path.endsWith('.svelte')) {
		return scriptsFromSvelte(code).flatMap(
			(script, index) =>
				parseModuleSpecifiers(
					script,
					`${path}#script-${index}`
				)
		);
	}

	return parseModuleSpecifiers(code, path);
}

function resolveRelativeImport(fromPath, specifier) {
	const base = resolve(dirname(fromPath), specifier);

	const candidates = [
		base,
		`${base}.ts`,
		`${base}.js`,
		`${base}.svelte`,
		join(base, 'index.ts'),
		join(base, 'index.js'),
		join(base, 'index.svelte')
	];

	if (base.endsWith('.js')) {
		candidates.push(
			`${base.slice(0, -3)}.ts`
		);
	}

	for (const candidate of candidates) {
		if (
			existsSync(candidate) &&
			statSync(candidate).isFile()
		) {
			return candidate;
		}
	}

	return null;
}

function verifyGraph(directory, label) {
	const files = collectFiles(
		directory,
		new Set(['.ts', '.js', '.svelte'])
	);

	for (const file of files) {
		const sourceGraph = graphFor(file, directory);

		for (const specifier of moduleSpecifiers(file)) {
			if (specifier.endsWith('.css')) {
				fail(
					`${label}: automatic CSS import forbidden: ` +
					`${normalize(relative(repositoryRoot, file))} -> ` +
					specifier
				);
			}

			if (!specifier.startsWith('.')) {
				continue;
			}

			const target = resolveRelativeImport(
				file,
				specifier
			);

			if (!target) {
				fail(
					`${label}: unresolved relative import: ` +
					`${normalize(relative(repositoryRoot, file))} -> ` +
					specifier
				);
				continue;
			}

			const localTarget = normalize(
				relative(directory, target)
			);

			if (
				localTarget === '..' ||
				localTarget.startsWith('../')
			) {
				fail(
					`${label}: import escapes package graph root: ` +
					`${normalize(relative(repositoryRoot, file))} -> ` +
					specifier
				);
				continue;
			}

			const targetGraph = graphFor(
				target,
				directory
			);

			if (!allowedDependencies[sourceGraph].has(targetGraph)) {
				fail(
					`${label}: cross-graph import forbidden: ` +
					`${sourceGraph} -> ${targetGraph}: ` +
					`${normalize(relative(repositoryRoot, file))} -> ` +
					specifier
				);
			}
		}
	}
}

const cssEntries = [
	{
		exportPath: './styles.css',
		source: join(sourceRoot, 'styles.css'),
		dist: join(distRoot, 'styles.css')
	},
	{
		exportPath: './visitor/styles.css',
		source: join(sourceRoot, 'visitor', 'styles.css'),
		dist: join(distRoot, 'visitor', 'styles.css')
	},
	{
		exportPath: './studio/styles.css',
		source: join(sourceRoot, 'studio', 'styles.css'),
		dist: join(distRoot, 'studio', 'styles.css')
	}
];

for (const entry of cssEntries) {
	if (!existsSync(entry.source)) {
		fail(
			`missing source CSS entry: ${normalize(
				relative(repositoryRoot, entry.source)
			)}`
		);
		continue;
	}

	if (!existsSync(entry.dist)) {
		fail(
			`missing packed CSS entry: ${normalize(
				relative(repositoryRoot, entry.dist)
			)}`
		);
	}

	const css = readFileSync(entry.source, 'utf8');

	if (/@import\b/i.test(css)) {
		fail(
			`${entry.exportPath}: CSS @import is forbidden`
		);
	}

	if (/\burl\s*\(/i.test(css)) {
		fail(
			`${entry.exportPath}: external CSS url() is forbidden`
		);
	}
}

const manifest = JSON.parse(
	readFileSync(
		join(repositoryRoot, 'package.json'),
		'utf8'
	)
);

const expectedCssExports = {
	'./styles.css': './dist/styles.css',
	'./visitor/styles.css':
		'./dist/visitor/styles.css',
	'./studio/styles.css':
		'./dist/studio/styles.css'
};

for (
	const [exportPath, target] of
	Object.entries(expectedCssExports)
) {
	if (manifest.exports?.[exportPath] !== target) {
		fail(
			`${exportPath}: unexpected manifest target`
		);
	}
}

verifyGraph(sourceRoot, 'source');
verifyGraph(distRoot, 'dist');

if (errors.length > 0) {
	console.error('Entry-graph verification failed:');

	for (const error of errors) {
		console.error(`- ${error}`);
	}

	process.exit(1);
}

console.log(
	'Entry graphs follow the root, visitor, studio and internal dependency matrix.'
);
console.log(
	'CSS entry points are explicit and not auto-imported.'
);
