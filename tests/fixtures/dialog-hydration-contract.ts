export const DIALOG_HYDRATION_SSR_BODY = "<!--[--><div data-testid=\"dialog-hydration-probe\" data-open=\"false\" data-action-count=\"0\"><button type=\"button\" data-testid=\"dialog-hydration-trigger\">Open hydrated dialog</button> <dialog aria-label=\"Hydrated dialog\" data-testid=\"dialog-hydration-dialog\" class=\"giu-dialog svelte-1gp63re\"><button type=\"button\" data-testid=\"dialog-hydration-focus\">Hydration focus</button><!----></dialog><!----></div><!--]-->";

export const DIALOG_INITIALLY_OPEN_HYDRATION_SSR_BODY = DIALOG_HYDRATION_SSR_BODY.replace(
	'data-open="false"',
	'data-open="true"'
);
