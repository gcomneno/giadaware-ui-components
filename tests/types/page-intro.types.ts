import { PageIntro } from '../../src/lib/studio/index.js';
import type { PageIntroProps } from '../../src/lib/studio/index.js';
import type { Snippet } from 'svelte';

declare const children: Snippet;

const props: PageIntroProps = {
	children,
	class: 'consumer-intro',
	style: '--giu-page-intro-margin: 0'
};

// @ts-expect-error children is required
const missingChildren: PageIntroProps = {};
// @ts-expect-error arbitrary paragraph attributes are not part of the public contract
const unsupportedRole: PageIntroProps = { children, role: 'note' };
// @ts-expect-error children must be a Svelte snippet
const invalidChildren: PageIntroProps = { children: 'Introduction' };

void [PageIntro, props, missingChildren, unsupportedRole, invalidChildren];
