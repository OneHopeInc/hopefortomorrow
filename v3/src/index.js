import { renderNavBar } from './components/NavBar.js';

/**
 * Renders a complete HTML page
 * @param {string} pathname - Current pathname
 * @param {string} content - Main content HTML
 * @returns {string} Complete HTML document
 */
function renderPage(pathname, content) {
	const navbar = renderNavBar({ pathname });
	
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>OneHope - Hope for Tomorrow</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<style>
		body {
			margin: 0;
			padding: 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		}
	</style>
</head>
<body class="bg-gray-50">
	${navbar}
	<main>
		${content}
	</main>
</body>
</html>`;
}

/**
 * Renders the home page content
 * @returns {string} Home page HTML content
 */
function renderHomePage() {
	return `
		<div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
			<div class="max-w-7xl mx-auto px-6 py-16">
				<div class="text-center">
					<h1 class="text-5xl font-bold text-gray-900 mb-6">
						Welcome to OneHope
					</h1>
					<p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Hope for Tomorrow - Empowering lives through education and faith
					</p>
					<div class="flex gap-4 justify-center">
						<a href="/curriculum" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
							View Curriculum
						</a>
						<a href="/about" class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
							Learn More
						</a>
					</div>
				</div>
			</div>
		</div>
	`;
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		
		// Handle home page
		if (pathname === '/' || pathname === '') {
			const html = renderPage('/', renderHomePage());
			return new Response(html, {
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				},
			});
		}
		
		// Handle other routes (can be extended later)
		return new Response('Page not found', { status: 404 });
	},
};
