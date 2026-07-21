export const FORM_STATUS_HYDRATION_PROPS = {
	message: 'Controlla i campi evidenziati',
	tone: 'warning',
	durationMs: 5_000,
	class: 'hydration-form-status'
} as const;

export const FORM_STATUS_SSR_BODY =
	'<!--[--><!--[0--><p class="form-status form-status--warning hydration-form-status svelte-1k42fwl" role="status" aria-live="polite" aria-atomic="true" data-tone="warning">Controlla i campi evidenziati</p><!--]--><!--]-->';
