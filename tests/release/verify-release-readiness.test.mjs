import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';

import {
	verifyReleaseReadiness
} from '../../scripts/verify-release-readiness.mjs';

const temporaryDirectories = [];

async function createRepository({
	version = '0.2.0',
	packageVersion = version,
	lockRootVersion = version,
	lockPackageVersion = version,
	privatePackage = true,
	prepublishOnly = 'node scripts/refuse-publish.mjs',
	publishConfig,
	verifierVersion = version,
	changelogVersion = version,
	changelogBody = '### Added\n\n- Release automation.'
} = {}) {
	const root = await mkdtemp(
		join(tmpdir(), 'giu-release-readiness-')
	);
	temporaryDirectories.push(root);

	await mkdir(join(root, 'scripts'), { recursive: true });

	const manifest = {
		name: 'giadaware-ui-components',
		version: packageVersion,
		private: privatePackage,
		scripts: {
			prepublishOnly
		}
	};

	if (publishConfig !== undefined) {
		manifest.publishConfig = publishConfig;
	}

	await writeFile(
		join(root, 'package.json'),
		`${JSON.stringify(manifest, null, '\t')}\n`
	);

	await writeFile(
		join(root, 'package-lock.json'),
		`${JSON.stringify(
			{
				name: 'giadaware-ui-components',
				version: lockRootVersion,
				lockfileVersion: 3,
				packages: {
					'': {
						name: 'giadaware-ui-components',
						version: lockPackageVersion
					}
				}
			},
			null,
			'\t'
		)}\n`
	);

	await writeFile(
		join(root, 'scripts/verify-manifest.mjs'),
		`requireValue(
	manifest.version === '${verifierVersion}',
	'unexpected package version'
);
`
	);

	await writeFile(
		join(root, 'CHANGELOG.md'),
		`# Changelog

## Unreleased

## ${changelogVersion} - 2026-09-01

${changelogBody}
`
	);

	return root;
}

afterEach(async () => {
	await Promise.all(
		temporaryDirectories.splice(0).map((directory) =>
			rm(directory, { recursive: true, force: true })
		)
	);
});

test('accepts a fully prepared release and extracts curated notes', async () => {
	const repositoryRoot = await createRepository();

	const release = await verifyReleaseReadiness({
		repositoryRoot,
		version: '0.2.0'
	});

	assert.equal(release.version, '0.2.0');
	assert.equal(release.tag, 'v0.2.0');
	assert.equal(release.date, '2026-09-01');
	assert.equal(
		release.notes,
		'### Added\n\n- Release automation.\n'
	);
});

test('rejects a v-prefixed or otherwise invalid requested version', async () => {
	const repositoryRoot = await createRepository();

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot,
			version: 'v0.2.0'
		}),
		/strict SemVer/
	);
});

test('rejects package version mismatch', async () => {
	const repositoryRoot = await createRepository({
		packageVersion: '0.1.0'
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot,
			version: '0.2.0'
		}),
		/package\.json version/
	);
});

test('rejects either lockfile version mismatch', async () => {
	const rootMismatch = await createRepository({
		lockRootVersion: '0.1.0'
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: rootMismatch,
			version: '0.2.0'
		}),
		/package-lock\.json root version/
	);

	const packageMismatch = await createRepository({
		lockPackageVersion: '0.1.0'
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: packageMismatch,
			version: '0.2.0'
		}),
		/package-lock\.json package version/
	);
});

test('rejects weakened registry-publication guards', async () => {
	const publicPackage = await createRepository({
		privatePackage: false
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: publicPackage,
			version: '0.2.0'
		}),
		/private: true/
	);

	const changedGuard = await createRepository({
		prepublishOnly: 'echo publish'
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: changedGuard,
			version: '0.2.0'
		}),
		/prepublishOnly refusal guard/
	);

	const publicationConfig = await createRepository({
		publishConfig: {
			access: 'public'
		}
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: publicationConfig,
			version: '0.2.0'
		}),
		/must not define publishConfig/
	);
});

test('rejects an unprepared manifest verifier', async () => {
	const repositoryRoot = await createRepository({
		verifierVersion: '0.1.0'
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot,
			version: '0.2.0'
		}),
		/does not deliberately expect 0\.2\.0/
	);
});

test('rejects a missing or empty curated changelog release section', async () => {
	const missingSection = await createRepository({
		changelogVersion: '0.1.0'
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: missingSection,
			version: '0.2.0'
		}),
		/does not contain a dated 0\.2\.0 release section/
	);

	const emptySection = await createRepository({
		changelogBody: ''
	});

	await assert.rejects(
		verifyReleaseReadiness({
			repositoryRoot: emptySection,
			version: '0.2.0'
		}),
		/release section 0\.2\.0 is empty/
	);
});
