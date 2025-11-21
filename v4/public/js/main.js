/**
 * Main Initialization Script
 * Initializes all components and animations on page load
 */

import { renderNavBar } from './NavBar.js';
import { initNavbarScroll } from './navbar-scroll.js';
import { initMainQuoteSection, initQuoteReveal, initQuoteText4 } from './quote-reveal.js';
import { initCardFadeIn } from './card-fade-in.js';
import { initCardGrid } from './card-grid.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

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

// Initialize main quote section
initMainQuoteSection();

// Initialize other quote sections (if they exist)
if (document.getElementById('quote-section-2')) {
	initQuoteReveal('quote-section-2', 'quote-text-2', 'quote-pin-container-2');
}

// Initialize tips introduction section (if it exists)
if (document.getElementById('tips-intro-section')) {
	initQuoteReveal('tips-intro-section', 'tips-intro-text', 'quote-pin-container');
}

// Initialize quote-text-4 for tips page (if it exists)
if (document.getElementById('quote-text-4')) {
	initQuoteText4();
}

// Initialize card grid (if container exists)
if (document.getElementById('card-grid-container')) {
	// Default week cards for discussions page
	const weekCards = [
		{ title: 'Week 1', cardImage: '/assets/week1.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=74E52A1D-C732-4439-BF969395CAD5D9C9' },
		{ title: 'Week 2', cardImage: '/assets/week2.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=3CFDDC9F-3B7B-456E-806D93FE8AEE3F02' },
		{ title: 'Week 3', cardImage: '/assets/week3.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=3A887B4B-5FD7-4D33-A24CCFCC544DC8C6' },
		{ title: 'Week 4', cardImage: '/assets/week4.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=A8626F18-1233-47C2-AC280867BE28D384' },
		{ title: 'Week 5', cardImage: '/assets/week5.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=6ED80D73-E6AB-49D4-893D4C099023AEDA' },
		{ title: 'Week 6', cardImage: '/assets/week6.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=BBFBA771-0AFB-4D81-BF4A4A7CECD26E6F' },
		{ title: 'Week 7', cardImage: '/assets/week7.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=75FBAA0D-A451-4401-B91D98AD622726C6' },
		{ title: 'Week 8', cardImage: '/assets/week8.png', imageUrl: '/assets/square-arrow-up-right.svg', href: 'https://www.hopegallery.org/share/C136A1AC-73A0-4011-B08C020A152EA02B/?viewType=grid&mediaId=BCB5A805-642D-4588-9D4E6690C57EFFBF' }
	];

	// Use week cards if on discussions page, otherwise use defaults (empty array = defaults)
	const cardData = pathname.includes('/discussions.html') || pathname.includes('/discussions')
		? { cards: weekCards, showPdfIcon: true }
		: {};

	initCardGrid('card-grid-container', cardData);
}

// Initialize curriculum grid (if container exists)
if (document.getElementById('curriculum-grid-container')) {
	// Curriculum cards: Lessons 1-12 (Getting Started is in the HTML)
	const curriculumCards = [
		{ title: 'Follow Me', subtitle: 'LESSON 01', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-1.html' },
		{ title: 'Starting Again', subtitle: 'LESSON 02', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-2.html' },
		{ title: 'Living By Faith', subtitle: 'LESSON 03', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-3.html' },
		{ title: 'Being, Not Performing', subtitle: 'LESSON 04', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-4.html' },
		{ title: 'Made for Relationships', subtitle: 'LESSON 05', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-5.html' },
		{ title: 'Made to be Whole', subtitle: 'LESSON 06', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-6.html' },
		{ title: 'Made on Purpose', subtitle: 'LESSON 07', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-7.html' },
		{ title: 'Made to be Light', subtitle: 'LESSON 08', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-8.html' },
		{ title: 'Called to One Body', subtitle: 'LESSON 09', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-9.html' },
		{ title: 'Called to One Kingdom', subtitle: 'LESSON 10', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-10.html' },
		{ title: 'Called to One Mission', subtitle: 'LESSON 11', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-11.html' },
		{ title: 'Called to One Lord', subtitle: 'LESSON 12', cardImage: '/assets/lessonimg.png', imageUrl: '/assets/square-arrow-right.svg', href: '/lessons/lesson-12.html' }
	];

	initCardGrid('curriculum-grid-container', { cards: curriculumCards });
}

// Initialize card fade-in animations for static cards (not dynamically created)
// Dynamic cards will initialize their own fade-in via card-grid.js
setTimeout(() => {
	initCardFadeIn();
}, 100);

// Refresh ScrollTrigger after all animations are set up
ScrollTrigger.refresh();

// Smooth scroll for anchor links (e.g., "Explore Resources" button)
// Handle all anchor links that point to sections on the same page
function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			const href = this.getAttribute('href');
			// Skip if it's just "#" or empty
			if (href === '#' || href === '') return;
			
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);
			
			if (targetElement) {
				e.preventDefault();
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});
}

// Initialize smooth scroll when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
	// DOM is already ready
	initSmoothScroll();
}

