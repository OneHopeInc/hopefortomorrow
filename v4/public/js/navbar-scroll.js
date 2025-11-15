/**
 * Navbar Scroll Handler
 * Handles showing/hiding the navbar based on scroll position
 */

/**
 * Initializes navbar scroll behavior
 * @param {HTMLElement} navbarContainer - The navbar container element
 * @param {HTMLElement} heroSection - The hero section element
 */
export function initNavbarScroll(navbarContainer, heroSection) {
	if (!navbarContainer || !heroSection) return;

	// Scroll event handler
	window.addEventListener('scroll', () => {
		const currentScrollY = window.scrollY;
		const heroHeight = heroSection.offsetHeight;

		// Show/hide navbar based on whether past hero section
		if (currentScrollY >= heroHeight) {
			// Past hero section - show navbar
			navbarContainer.style.opacity = '1';
		} else {
			// Still in hero section - hide navbar
			navbarContainer.style.opacity = '0';
		}
	});
}

