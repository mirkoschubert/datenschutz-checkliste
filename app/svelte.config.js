import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Vercel adapter for deployment
		// See https://vercel.com/docs/frameworks/sveltekit
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
