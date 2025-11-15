/**
 * Main Initialization Script
 * Initializes all components and animations on page load
 */

import { renderNavBar } from './NavBar.js';
import { initAnimatedInlineText } from './AnimatedInlineText.js';
import { initNavbarScroll } from './navbar-scroll.js';
import { initMainQuoteSection, initQuoteReveal } from './quote-reveal.js';

// Get the current pathname
const pathname = window.location.pathname;
const navbarContainer = document.getElementById('navbar-container');

// Get hero section to determine when to show navbar
const heroSection = document.querySelector('section[class*="h-screen"]');

// Initial render (opacity already set inline to prevent flash)
const navbarHTML = renderNavBar({ pathname });
navbarContainer.innerHTML = navbarHTML;

// Initialize navbar scroll behavior
initNavbarScroll(navbarContainer, heroSection);

// Initialize animated text for bold spans
initAnimatedInlineText({
	selector: '.animated-bold-text',
	animation: {
		color: 'linear-gradient(to right, #F39230, #F3C230)', // Orange to purple gradient
	},
	onScroll: {
		enter: 'bottom 61%',
		leave: 'bottom 60%'
	}
});

// Initialize main quote section
initMainQuoteSection();

// Initialize other quote sections (if they exist)
if (document.getElementById('quote-section-2')) {
	initQuoteReveal('quote-section-2', 'quote-text-2', 'quote-pin-container-2');
}

