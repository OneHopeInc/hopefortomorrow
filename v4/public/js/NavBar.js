/**
 * NavBar Component with Breadcrumb Navigation
 * Simple JavaScript implementation for breadcrumb navigation
 */

/**
 * Formats a path segment to a readable label
 * Converts kebab-case to ALL CAPS
 * @param {string} segment - Path segment (e.g., "lesson-1")
 * @returns {string} Formatted label (e.g., "LESSON 1")
 */
function formatSegment(segment) {
	return segment
		.split("-")
		.map((word) => word.toUpperCase())
		.join(" ");
}

/**
 * Builds breadcrumbs from a pathname
 * @param {string} pathname - Current pathname (e.g., "/curriculum/lesson-1")
 * @returns {Array} Array of breadcrumb objects with label and path
 */
function buildBreadcrumbs(pathname) {
	const pathSegments = pathname.split("/").filter(Boolean);
	const breadcrumbs = [{ label: "HOME", path: "/" }];

	// Handle gettingstarted.html as a sub-page of curriculum
	if (pathname.includes('gettingstarted.html') || pathname.includes('/gettingstarted')) {
		breadcrumbs.push({ label: "CURRICULUM", path: "/curriculum.html" });
		breadcrumbs.push({ label: "GETTING STARTED", path: pathname });
		return breadcrumbs;
	}

	// Handle lesson pages (lessons/lesson-X.html) as sub-pages of curriculum
	// Check for lesson pages in various formats
	const lessonMatch = pathname.match(/lesson-(\d+)\.html/);
	if (lessonMatch) {
		const lessonNumber = lessonMatch[1];
		breadcrumbs.push({ label: "CURRICULUM", path: "/curriculum.html" });
		breadcrumbs.push({ label: `LESSON ${lessonNumber}`, path: pathname });
		return breadcrumbs;
	}

	for (let index = 0; index < pathSegments.length; index++) {
		const segment = pathSegments[index];
		// Remove .html extension for cleaner breadcrumb labels
		const cleanSegment = segment.replace(/\.html$/, '');
		const path = "/" + pathSegments.slice(0, index + 1).join("/");
		let label = formatSegment(cleanSegment);
		
		// Replace "LESSONS" with "CURRICULUM" for consistency
		if (label === "LESSONS") {
			label = "CURRICULUM";
			// Update path to point to curriculum page instead of lessons directory
			breadcrumbs.push({ label, path: "/curriculum.html" });
			continue; // Skip adding this segment normally, we've handled it
		}
		
		breadcrumbs.push({ label, path });
	}

	return breadcrumbs;
}

/**
 * Renders the NavBar component as HTML string
 * @param {Object} options - Configuration options
 * @param {string} options.pathname - Current pathname
 * @param {string} options.logoPath - Path to logo image (default: "/assets/OneHope Logo White-01 (1).png")
 * @returns {string} HTML string for the navbar
 */
export function renderNavBar({ pathname = "/", logoPath = "/assets/OneHope Logo White-01 (1).png" }) {
	const breadcrumbs = buildBreadcrumbs(pathname);

	const breadcrumbHTML = breadcrumbs
		.map((crumb, index) => {
			// Normalize paths for comparison (remove .html extension and trailing slashes)
			const normalizedPathname = pathname.replace(/\.html$/, '').replace(/\/$/, '');
			const normalizedCrumbPath = crumb.path.replace(/\.html$/, '').replace(/\/$/, '');
			const isActive = normalizedPathname === normalizedCrumbPath || pathname === crumb.path;
			const activeClass = isActive ? "font-semibold text-white/90" : "";
			const separator = index > 0 ? '<span class="text-white/50">/</span>' : "";

			return `
				<div class="flex items-center gap-2">
					${separator}
					<a href="${crumb.path}" class="hover:text-white/90 transition-all duration-300 ease-in-out cursor-pointer text-white/70 ${activeClass}">
						${crumb.label}
					</a>
				</div>
			`;
		})
		.join("");

	return `
		<nav class="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden bg-[#121212] border-b border-white/10">
			<div class="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-2 md:py-2">
				<div class="flex items-center gap-2 font-regular text-white/70 text-md md:text-md min-w-0 flex-1 overflow-x-hidden">
					${breadcrumbHTML}
				</div>
				<div class="hidden md:flex items-center flex-shrink-0">
					<img 
						src="${logoPath}" 
						alt="OneHope Logo" 
						width="110" 
						height="50" 
						class="h-auto"
					/>
				</div>
			</div>
		</nav>
	`;
}

/**
 * NavBar class for more advanced usage
 */
export class NavBar {
	constructor(options = {}) {
		this.pathname = options.pathname || "/";
		this.logoPath = options.logoPath || "/assets/OneHope Logo White-01 (1).png";
	}

	/**
	 * Updates the pathname
	 * @param {string} pathname - New pathname
	 */
	setPathname(pathname) {
		this.pathname = pathname;
	}

	/**
	 * Renders the navbar as HTML
	 * @returns {string} HTML string
	 */
	render() {
		return renderNavBar({
			pathname: this.pathname,
			logoPath: this.logoPath,
		});
	}

	/**
	 * Gets the breadcrumbs array
	 * @returns {Array} Array of breadcrumb objects
	 */
	getBreadcrumbs() {
		return buildBreadcrumbs(this.pathname);
	}
}

export default { renderNavBar, NavBar, buildBreadcrumbs, formatSegment };

