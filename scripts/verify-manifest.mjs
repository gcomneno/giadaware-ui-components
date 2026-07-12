import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(
	await readFile(new URL('../package.json', import.meta.url), 'utf8')
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
