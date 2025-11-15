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

	pathSegments.forEach((segment, index) => {
		const path = "/" + pathSegments.slice(0, index + 1).join("/");
		const label = formatSegment(segment);
		breadcrumbs.push({ label, path });
	});

	return breadcrumbs;
}

/**
 * Renders the NavBar component as HTML string
 * @param {Object} options - Configuration options
 * @param {string} options.pathname - Current pathname
 * @param {string} options.logoPath - Path to logo image (default: "/OneHopeBlack.png")
 * @param {boolean} options.isScrolled - Whether navbar is scrolled (default: false)
 * @returns {string} HTML string for the navbar
 */
export function renderNavBar({ pathname = "/", logoPath = "/OneHopeBlack.png", isScrolled = false }) {
	const breadcrumbs = buildBreadcrumbs(pathname);
	const paddingClass = isScrolled ? "px-6 py-2" : "px-6 py-4";
	const textSizeClass = isScrolled ? "text-sm" : "text-md";
	const logoScaleClass = isScrolled ? "scale-[0.82]" : "scale-100";

	const breadcrumbHTML = breadcrumbs
		.map((crumb, index) => {
			const isActive = pathname === crumb.path;
			const activeClass = isActive ? "font-semibold text-black/70" : "";
			const separator = index > 0 ? '<span class="text-black/50">/</span>' : "";

			return `
				<div class="flex items-center gap-2">
					${separator}
					<a href="${crumb.path}" class="hover:text-black/70 transition-colors cursor-pointer ${activeClass}">
						${crumb.label}
					</a>
				</div>
			`;
		})
		.join("");

	return `
		<nav class="sticky top-0 z-50 w-full flex items-center justify-between bg-white border-b border-gray-200 transition-all duration-300 ${paddingClass}">
			<div class="flex items-center gap-2 font-regular text-black/50 transition-all duration-300 ${textSizeClass}">
				${breadcrumbHTML}
			</div>
			<div class="flex items-center transition-all duration-300 ${logoScaleClass}">
				<img 
					src="${logoPath}" 
					alt="OneHope Logo" 
					width="110" 
					height="50" 
					class="h-auto transition-all duration-300"
				/>
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
		this.logoPath = options.logoPath || "/OneHopeBlack.png";
		this.isScrolled = options.isScrolled || false;
	}

	/**
	 * Updates the pathname
	 * @param {string} pathname - New pathname
	 */
	setPathname(pathname) {
		this.pathname = pathname;
	}

	/**
	 * Updates the scroll state
	 * @param {boolean} isScrolled - Whether navbar is scrolled
	 */
	setScrolled(isScrolled) {
		this.isScrolled = isScrolled;
	}

	/**
	 * Renders the navbar as HTML
	 * @returns {string} HTML string
	 */
	render() {
		return renderNavBar({
			pathname: this.pathname,
			logoPath: this.logoPath,
			isScrolled: this.isScrolled,
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

