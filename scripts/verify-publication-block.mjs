import { spawnSync } from 'node:child_process';
import {
	mkdtemp,
	rm,
	writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(
	new URL('..', import.meta.url)
);

function expectFailure(
	label,
	command,
	args,
	expectedOutput
) {
	const result = spawnSync(command, args, {
		cwd: repositoryRoot,
		encoding: 'utf8'
	});

	if (result.error) {
		throw result.error;
	}

	const output = [
		result.stdout ?? '',
		result.stderr ?? ''
	].join('\n');

	if (result.status === 0) {
		throw new Error(
			`${label} unexpectedly succeeded`
		);
	}

	if (!expectedOutput.test(output)) {
		console.error(output);

		throw new Error(
			`${label} failed for an unexpected reason`
		);
	}

	console.log(`${label}: blocked as expected.`);
}

expectFailure(
	'explicit prepublish guard',
	process.execPath,
	['scripts/refuse-publish.mjs'],
	/Registry publication is forbidden/i
);

const temporaryRoot = await mkdtemp(
	join(tmpdir(), 'giu-publication-')
);

try {
	const userConfig = join(
		temporaryRoot,
		'.npmrc'
	);

	await writeFile(
		userConfig,
		[
			'registry=http://127.0.0.1:9/',
			'//127.0.0.1:9/:_authToken=deliberately-fake',
			''
		].join('\n')
	);

	expectFailure(
		'npm private-package publish against isolated registry',
		'npm',
		[
			'publish',
			'--ignore-scripts',
			'--force',
			`--userconfig=${userConfig}`,
			'--registry=http://127.0.0.1:9/',
			'--fetch-retries=0',
			'--fetch-timeout=1000',
			'--loglevel=error'
		],
		/(EPRIVATE|marked as private|private[\s\S]*publish)/i
	);
} finally {
	await rm(temporaryRoot, {
		recursive: true,
		force: true
	});
}

console.log('Registry publication remains blocked.');
