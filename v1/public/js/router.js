// Simple router implementation for SPA
class Router {
	constructor() {
		this.routes = {
			'/': 'home',
			'/resources': 'resources',
			'/lessons': 'lessons'
		};
		this.pageTitles = {
			'home': 'HOME',
			'resources': 'RESOURCES',
			'lessons': 'LESSONS'
		};
		this.currentPage = 'home';
		this.init();
	}

	init() {
		// Handle navigation clicks
		document.querySelectorAll('.nav-link').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const href = link.getAttribute('href');
				this.navigate(href);
			});
		});

		// Handle browser back/forward
		window.addEventListener('popstate', () => {
			this.handleRoute();
		});

		// Initial route
		this.handleRoute();
	}

	navigate(path) {
		window.history.pushState({}, '', path);
		this.handleRoute();
	}

	handleRoute() {
		const path = window.location.pathname;
		const page = this.routes[path] || 'home';
		this.showPage(page);
		this.updateActiveNav();
		this.updateBreadcrumb(page);
	}

	showPage(pageName) {
		// Hide all pages
		document.querySelectorAll('.page').forEach(page => {
			page.classList.remove('active');
		});

		// Show current page
		const currentPage = document.getElementById(pageName);
		if (currentPage) {
			currentPage.classList.add('active');
		}

		this.currentPage = pageName;
	}

	updateActiveNav() {
		// Remove active class from all nav links
		document.querySelectorAll('.nav-link').forEach(link => {
			link.classList.remove('active');
		});

		// Add active class to current page link
		const currentLink = document.querySelector(`[data-page="${this.currentPage}"]`);
		if (currentLink) {
			currentLink.classList.add('active');
		}
	}

	updateBreadcrumb(pageName) {
		const currentPageElement = document.getElementById('current-page');
		if (currentPageElement) {
			const pageTitle = this.pageTitles[pageName] || 'HOME';
			currentPageElement.textContent = pageTitle;
		}
	}
}

// Initialize the router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new Router();
	
	// Intersection Observer for fade-in animations
	const observerOptions = {
		threshold: 0.5, // Trigger when 50% of the element is visible
		rootMargin: '0px 0px -100px 0px' // Trigger slightly before the element is fully in view
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				// Get all stat items in the same section
				const section = entry.target.closest('section');
				const statItems = section.querySelectorAll('.stat-item');
				
				// Add fade-in class with sequential delays
				statItems.forEach((item, index) => {
					setTimeout(() => {
						item.classList.add('fade-in');
					}, index * 200); // 200ms delay between each card
				});
				
				// Unobserve after animation to prevent re-triggering
				statItems.forEach(item => observer.unobserve(item));
			}
		});
	}, observerOptions);

	// Observe all stat items
	document.querySelectorAll('.stat-item').forEach(item => {
		observer.observe(item);
	});
}); 