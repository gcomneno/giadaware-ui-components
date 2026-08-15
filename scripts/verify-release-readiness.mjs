import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRepositoryRoot = resolve(
	fileURLToPath(new URL('..', import.meta.url))
);

const strictSemverPattern =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function readJson(repositoryRoot, path) {
	return JSON.parse(
		await readFile(resolve(repositoryRoot, path), 'utf8')
	);
}

function requireValue(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function extractReleaseNotes(changelog, version) {
	const headingPattern = new RegExp(
		`^## ${escapeRegExp(version)} - (\\d{4}-\\d{2}-\\d{2})$`,
		'm'
	);
	const headingMatch = changelog.match(headingPattern);

	requireValue(
		headingMatch !== null,
		`CHANGELOG.md does not contain a dated ${version} release section`
	);

	const headingIndex = headingMatch.index;
	const bodyStart = headingIndex + headingMatch[0].length;
	const remaining = changelog.slice(bodyStart);
	const nextReleaseHeading = remaining.search(/^## /m);
	const body = (
		nextReleaseHeading === -1
			? remaining
			: remaining.slice(0, nextReleaseHeading)
	).trim();

	requireValue(
		body.length > 0,
		`CHANGELOG.md release section ${version} is empty`
	);

	return {
		date: headingMatch[1],
		notes: `${body}\n`
	};
}

export async function verifyReleaseReadiness({
	repositoryRoot = defaultRepositoryRoot,
	version
} = {}) {
	const manifest = await readJson(repositoryRoot, 'package.json');
	const lockfile = await readJson(repositoryRoot, 'package-lock.json');
	const manifestVerifier = await readFile(
		resolve(repositoryRoot, 'scripts/verify-manifest.mjs'),
		'utf8'
	);
	const changelog = await readFile(
		resolve(repositoryRoot, 'CHANGELOG.md'),
		'utf8'
	);

	const requestedVersion = version ?? manifest.version;

	requireValue(
		typeof requestedVersion === 'string' &&
			strictSemverPattern.test(requestedVersion),
		`release version must be strict SemVer without a v prefix: ${requestedVersion}`
	);

	requireValue(
		manifest.version === requestedVersion,
		`package.json version ${manifest.version} does not match requested ${requestedVersion}`
	);

	requireValue(
		lockfile.version === requestedVersion,
		`package-lock.json root version ${lockfile.version} does not match requested ${requestedVersion}`
	);

	requireValue(
		lockfile.packages?.['']?.version === requestedVersion,
		`package-lock.json package version ${lockfile.packages?.['']?.version} does not match requested ${requestedVersion}`
	);

	requireValue(
		manifest.private === true,
		'package.json must preserve private: true'
	);

	requireValue(
		manifest.scripts?.prepublishOnly ===
			'node scripts/refuse-publish.mjs',
		'package.json must preserve the explicit prepublishOnly refusal guard'
	);

	requireValue(
		manifest.publishConfig === undefined,
		'package.json must not define publishConfig during private incubation'
	);

	const verifierVersionPattern = new RegExp(
		`manifest\\.version\\s*===\\s*['"]${escapeRegExp(requestedVersion)}['"]`
	);

	requireValue(
		verifierVersionPattern.test(manifestVerifier),
		`scripts/verify-manifest.mjs does not deliberately expect ${requestedVersion}`
	);

	const release = extractReleaseNotes(changelog, requestedVersion);

	return {
		version: requestedVersion,
		tag: `v${requestedVersion}`,
		date: release.date,
		notes: release.notes
	};
}

function parseArguments(argv) {
	const options = {};

	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];

		if (argument === '--version') {
			if (!argv[index + 1] || argv[index + 1].startsWith('--')) {
				throw new Error('--version requires a value');
			}

			options.version = argv[index + 1];
			index += 1;
			continue;
		}

		if (argument === '--notes-file') {
			if (!argv[index + 1] || argv[index + 1].startsWith('--')) {
				throw new Error('--notes-file requires a value');
			}

			options.notesFile = argv[index + 1];
			index += 1;
			continue;
		}

		throw new Error(`unknown argument: ${argument}`);
	}

	return options;
}

const invokedDirectly =
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
	const options = parseArguments(process.argv.slice(2));
	const release = await verifyReleaseReadiness({
		version: options.version
	});

	if (options.notesFile) {
		await writeFile(options.notesFile, release.notes, 'utf8');
	}

	console.log(
		`Release readiness verified: ${release.tag} (${release.date}).`
	);
}
