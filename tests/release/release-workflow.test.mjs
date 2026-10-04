import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const workflowUrl = new URL(
	'../../.github/workflows/release.yml',
	import.meta.url
);

test('release workflow uses runner temporary storage only at runtime', async () => {
	const workflow = await readFile(workflowUrl, 'utf8');

	assert.doesNotMatch(
		workflow,
		/\$\{\{\s*runner\./,
		'runner context must not be evaluated in job-level workflow configuration'
	);

	const runtimeNotesFile =
		'--notes-file "$RUNNER_TEMP/release-notes.md"';

	assert.equal(
		workflow.split(runtimeNotesFile).length - 1,
		3,
		'all release-note consumers must use RUNNER_TEMP at runner runtime'
	);
});
