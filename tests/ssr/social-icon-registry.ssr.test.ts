import { describe, expect, test } from 'vitest';

import {
	SOCIAL_ICON_IDS,
	isSocialIconId
} from '../../src/lib/social-icon.js';

describe('SocialIcon registry', () => {
	test('exposes the exact supported icon identifiers', () => {
		expect(SOCIAL_ICON_IDS).toEqual([
			'instagram',
			'facebook',
			'x',
			'github',
			'github-sponsors'
		]);
	});

	test('freezes the supported icon identifiers at runtime', () => {
		expect(Object.isFrozen(SOCIAL_ICON_IDS)).toBe(true);
	});

	test.each(SOCIAL_ICON_IDS)(
		'accepts the supported identifier %s',
		(id) => {
			expect(isSocialIconId(id)).toBe(true);
		}
	);

	test.each([
		'',
		'GitHub',
		'github_sponsors',
		'linkedin',
		null,
		undefined,
		24,
		{},
		[]
	])('rejects the unsupported value %j', (value) => {
		expect(isSocialIconId(value)).toBe(false);
	});
});
