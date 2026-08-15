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
	normalize,
	relative,
	resolve,
	sep
} from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(
	fileURLToPath(new URL('..', import.meta.url))
);

const externalUrlPattern = /^[a-z][a-z0-9+.-]*:/i;
const errors = [];

const englishOnlyDocuments = new Set([
	'AGENTS.md',
	'CHANGELOG.md',
	'SECURITY.md',
	'THIRD_PARTY_NOTICES.md'
]);

const englishOnlyPrefixes = ['docs/architecture/'];

function toRepositoryPath(path) {
	return relative(repositoryRoot, path).split(sep).join('/');
}

function fromRepositoryPath(path) {
	return join(repositoryRoot, ...path.split('/'));
}

function fail(message) {
	errors.push(message);
}

function existsFile(repositoryPath) {
	const path = fromRepositoryPath(repositoryPath);
	return existsSync(path) && statSync(path).isFile();
}

function readDocument(repositoryPath) {
	return readFileSync(fromRepositoryPath(repositoryPath), 'utf8');
}

function isEnglishOnly(repositoryPath) {
	return (
		englishOnlyDocuments.has(repositoryPath) ||
		englishOnlyPrefixes.some((prefix) =>
			repositoryPath.startsWith(prefix)
		)
	);
}

function isItalianMirror(repositoryPath) {
	if (repositoryPath === 'README.it.md') {
		return true;
	}

	if (repositoryPath === 'CONTRIBUTING.it.md') {
		return true;
	}

	return repositoryPath.startsWith('docs/it/');
}

function italianMirrorFor(repositoryPath) {
	if (repositoryPath === 'README.md') {
		return 'README.it.md';
	}

	if (repositoryPath === 'CONTRIBUTING.md') {
		return 'CONTRIBUTING.it.md';
	}

	if (repositoryPath.startsWith('docs/')) {
		return `docs/it/${repositoryPath.slice('docs/'.length)}`;
	}

	return null;
}

function englishCanonicalFor(repositoryPath) {
	if (repositoryPath === 'README.it.md') {
		return 'README.md';
	}

	if (repositoryPath === 'CONTRIBUTING.it.md') {
		return 'CONTRIBUTING.md';
	}

	if (repositoryPath.startsWith('docs/it/')) {
		return `docs/${repositoryPath.slice('docs/it/'.length)}`;
	}

	return null;
}

function maintainedEnglishDocuments() {
	const rootPairs = ['README.md', 'CONTRIBUTING.md'];
	const docs = readdirSync(fromRepositoryPath('docs'))
		.filter((entry) => extname(entry) === '.md')
		.sort()
		.map((entry) => `docs/${entry}`);

	return [...rootPairs, ...docs];
}

function stripCodeFences(markdown) {
	const lines = markdown.split('\n');
	let fenced = false;

	return lines
		.map((line) => {
			if (/^\s*```/.test(line)) {
				fenced = !fenced;
				return '';
			}

			return fenced ? '' : line;
		})
		.join('\n');
}

function slugHeading(heading) {
	return heading
		.trim()
		.toLowerCase()
		.replace(/`([^`]*)`/g, '$1')
		.replace(/<[^>]*>/g, '')
		.replace(/&[a-z0-9#]+;/gi, '')
		.replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
		.trim()
		.replace(/\s+/g, '-');
}

function anchorsFor(repositoryPath) {
	const stripped = stripCodeFences(readDocument(repositoryPath));
	const anchors = new Set();
	const seen = new Map();

	for (const line of stripped.split('\n')) {
		const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);

		if (!match) {
			continue;
		}

		const base = slugHeading(match[2]);
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		anchors.add(count === 0 ? base : `${base}-${count}`);
	}

	return anchors;
}

function decodeLinkTarget(target) {
	try {
		return decodeURI(target);
	} catch {
		return target;
	}
}

function markdownLinks(repositoryPath) {
	const markdown = stripCodeFences(readDocument(repositoryPath));
	const links = [];
	const pattern = /!?\[[^\]\n]*(?:\][^\[\]\n]*)*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

	for (const match of markdown.matchAll(pattern)) {
		if (match[0].startsWith('![')) {
			continue;
		}

		links.push({
			raw: match[1],
			index: match.index
		});
	}

	return links;
}

function splitTarget(target) {
	const hashIndex = target.indexOf('#');

	if (hashIndex === -1) {
		return {
			pathPart: target,
			anchor: null
		};
	}

	return {
		pathPart: target.slice(0, hashIndex),
		anchor: target.slice(hashIndex + 1)
	};
}

function resolveLocalTarget(sourceDocument, rawTarget) {
	const target = decodeLinkTarget(rawTarget);

	if (
		target.startsWith('//') ||
		externalUrlPattern.test(target)
	) {
		return null;
	}

	const { pathPart, anchor } = splitTarget(target);
	const sourceDirectory = dirname(fromRepositoryPath(sourceDocument));
	const absoluteTarget = pathPart
		? resolve(sourceDirectory, pathPart)
		: fromRepositoryPath(sourceDocument);

	const normalizedTarget = normalize(absoluteTarget);

	if (
		normalizedTarget !== repositoryRoot &&
		!normalizedTarget.startsWith(`${repositoryRoot}${sep}`)
	) {
		return {
			target,
			pathPart,
			anchor,
			repositoryPath: null
		};
	}

	return {
		target,
		pathPart,
		anchor,
		repositoryPath: toRepositoryPath(normalizedTarget)
	};
}

function validateSelector(sourceDocument, englishTarget, italianTarget) {
	const markdown = stripCodeFences(readDocument(sourceDocument));
	const selectorPattern =
		/\[English\]\(([^)]+)\)\s+\|\s+\[Italiano\]\(([^)]+)\)/;
	const match = selectorPattern.exec(markdown);

	if (!match) {
		fail(`${sourceDocument}: missing reciprocal language selector`);
		return;
	}

	const resolvedEnglish = resolveLocalTarget(sourceDocument, match[1]);
	const resolvedItalian = resolveLocalTarget(sourceDocument, match[2]);

	if (resolvedEnglish?.repositoryPath !== englishTarget) {
		fail(
			`${sourceDocument}: English selector points to ${match[1]}, expected ${englishTarget}`
		);
	}

	if (resolvedItalian?.repositoryPath !== italianTarget) {
		fail(
			`${sourceDocument}: Italiano selector points to ${match[2]}, expected ${italianTarget}`
		);
	}
}

function validateRequiredPairs(englishDocuments) {
	for (const englishDocument of englishDocuments) {
		const italianDocument = italianMirrorFor(englishDocument);

		if (!existsFile(englishDocument)) {
			fail(`${englishDocument}: required canonical document is missing`);
		}

		if (!italianDocument || !existsFile(italianDocument)) {
			fail(
				`${englishDocument}: required Italian mirror ${italianDocument} is missing`
			);
			continue;
		}

		validateSelector(
			englishDocument,
			englishDocument,
			italianDocument
		);
		validateSelector(
			italianDocument,
			englishDocument,
			italianDocument
		);
	}
}

function validateNoOrphanItalianMirrors(englishDocuments) {
	const expected = new Set(
		englishDocuments.map((document) => italianMirrorFor(document))
	);

	const actual = [
		...readdirSync(repositoryRoot)
			.filter((entry) => entry.endsWith('.it.md'))
			.map((entry) => entry),
		...(
			existsSync(fromRepositoryPath('docs/it'))
				? readdirSync(fromRepositoryPath('docs/it'))
					.filter((entry) => entry.endsWith('.md'))
					.map((entry) => `docs/it/${entry}`)
				: []
		)
	];

	for (const italianDocument of actual) {
		if (!expected.has(italianDocument)) {
			fail(`${italianDocument}: orphan maintained Italian mirror`);
		}
	}
}

function validateLinks(documents) {
	const anchorCache = new Map();

	function anchors(repositoryPath) {
		if (!anchorCache.has(repositoryPath)) {
			anchorCache.set(repositoryPath, anchorsFor(repositoryPath));
		}

		return anchorCache.get(repositoryPath);
	}

	for (const sourceDocument of documents) {
		for (const link of markdownLinks(sourceDocument)) {
			const target = resolveLocalTarget(sourceDocument, link.raw);

			if (!target) {
				continue;
			}

			if (!target.repositoryPath) {
				fail(
					`${sourceDocument}: link ${link.raw} points outside the repository`
				);
				continue;
			}

			if (!existsFile(target.repositoryPath)) {
				fail(
					`${sourceDocument}: link ${link.raw} resolves to missing ${target.repositoryPath}`
				);
				continue;
			}

			if (
				target.anchor !== null &&
				target.anchor !== '' &&
				!anchors(target.repositoryPath).has(target.anchor)
			) {
				fail(
					`${sourceDocument}: link ${link.raw} points to missing anchor #${target.anchor} in ${target.repositoryPath}`
				);
			}

			validateSameLanguageLink(sourceDocument, link.raw, target.repositoryPath);
		}
	}
}

function validateSameLanguageLink(sourceDocument, rawTarget, targetDocument) {
	if (targetDocument === italianMirrorFor(sourceDocument)) {
		return;
	}

	if (isItalianMirror(sourceDocument)) {
		const italianMirror = italianMirrorFor(targetDocument);

		if (
			italianMirror &&
			existsFile(italianMirror) &&
			targetDocument !== englishCanonicalFor(sourceDocument) &&
			targetDocument !== sourceDocument &&
			!isEnglishOnly(targetDocument) &&
			!isItalianMirror(targetDocument)
		) {
			fail(
				`${sourceDocument}: link ${rawTarget} should use same-language mirror ${italianMirror}`
			);
		}

		return;
	}

	if (isItalianMirror(targetDocument)) {
		fail(
			`${sourceDocument}: link ${rawTarget} routes canonical English navigation through Italian mirror ${targetDocument}`
		);
	}
}

const englishDocuments = maintainedEnglishDocuments();
const italianDocuments = englishDocuments.map((document) =>
	italianMirrorFor(document)
);
const maintainedDocuments = [...englishDocuments, ...italianDocuments];

validateRequiredPairs(englishDocuments);
validateNoOrphanItalianMirrors(englishDocuments);
validateLinks(maintainedDocuments.filter((document) => existsFile(document)));

if (errors.length > 0) {
	console.error('Documentation verification failed:');

	for (const error of errors) {
		console.error(`- ${error}`);
	}

	process.exit(1);
}

console.log(
	`Documentation verification passed: ${englishDocuments.length} bilingual pairs and ${maintainedDocuments.length} maintained documents checked.`
);
