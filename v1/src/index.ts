/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		
		// Handle API endpoints
		if (url.pathname.startsWith('/api/')) {
			switch (url.pathname) {
				case '/api/message':
					return new Response('Hello, World!');
				case '/api/random':
					return new Response(crypto.randomUUID());
				default:
					return new Response('API Not Found', { status: 404 });
			}
		}

		// For SPA routing, we need to serve index.html for all routes
		// except API routes and static assets
		if (!url.pathname.includes('.') && !url.pathname.startsWith('/api/')) {
			// Redirect to root to serve index.html, which will handle client-side routing
			return Response.redirect(new URL('/', request.url).toString(), 302);
		}

		// Let Cloudflare handle static assets and other files
		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
