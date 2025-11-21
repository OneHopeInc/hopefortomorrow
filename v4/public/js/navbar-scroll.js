/**
 * Navbar Scroll Handler
 * Handles showing/hiding the navbar based on scroll position
 */
export function initNavbarScroll(navbarContainer, heroSection) {
	if (!navbarContainer || !heroSection) return;

	window.addEventListener('scroll', () => {
		navbarContainer.style.opacity = window.scrollY >= heroSection.offsetHeight ? '1' : '0';
	});
}

