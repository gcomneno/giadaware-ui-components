import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    // Repository-only consumer demo resolution. These are exact public specifiers.
    // Real packed consumption remains independently checked by verify:pack.
    resolve: {
        alias: [
            {
                find: /^giadaware-ui-components$/,
                replacement: decodeURIComponent(new URL('./src/lib/index.ts', import.meta.url).pathname)
            },
            {
                find: /^giadaware-ui-components\/styles\.css$/,
                replacement: decodeURIComponent(new URL('./src/lib/styles.css', import.meta.url).pathname)
            }
        ]
    },
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	]
});
