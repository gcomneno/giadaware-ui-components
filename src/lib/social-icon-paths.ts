import type { SocialIconId } from './social-icon.js';
import { FACEBOOK_PATH } from './social-icons/facebook.js';
import { GITHUB_SPONSORS_PATH } from './social-icons/github-sponsors.js';
import { GITHUB_PATH } from './social-icons/github.js';
import { INSTAGRAM_PATH } from './social-icons/instagram.js';
import { X_PATH } from './social-icons/x.js';

export const SOCIAL_ICON_PATHS: Readonly<Record<SocialIconId, string>> = {
	instagram: INSTAGRAM_PATH,
	facebook: FACEBOOK_PATH,
	x: X_PATH,
	github: GITHUB_PATH,
	'github-sponsors': GITHUB_SPONSORS_PATH
};
