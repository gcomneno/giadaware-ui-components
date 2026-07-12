import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte()],
	test: {
		name: 'ssr',
		environment: 'node',
		include: ['tests/ssr/**/*.ssr.test.ts']
	}
});
