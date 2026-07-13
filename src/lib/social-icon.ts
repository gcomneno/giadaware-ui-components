export const SOCIAL_ICON_IDS = Object.freeze([
	'instagram',
	'facebook',
	'x',
	'github',
	'github-sponsors'
] as const);

export type SocialIconId = (typeof SOCIAL_ICON_IDS)[number];

const socialIconIdSet: ReadonlySet<string> = new Set(SOCIAL_ICON_IDS);

export function isSocialIconId(value: unknown): value is SocialIconId {
	return typeof value === 'string' && socialIconIdSet.has(value);
}
