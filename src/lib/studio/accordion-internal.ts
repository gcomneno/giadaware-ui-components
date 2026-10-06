import {
	getContext,
	setContext
} from 'svelte';

type AccordionContext = {
	getGroupName: () => string | undefined;
};

const ACCORDION_CONTEXT = Symbol('giu-accordion-context');

export function provideAccordionContext(
	context: AccordionContext
): void {
	setContext(ACCORDION_CONTEXT, context);
}

export function useAccordionContext(): AccordionContext {
	const context = getContext<AccordionContext | undefined>(
		ACCORDION_CONTEXT
	);

	if (!context) {
		throw new Error(
			'AccordionItem must be rendered inside an Accordion component.'
		);
	}

	return context;
}
