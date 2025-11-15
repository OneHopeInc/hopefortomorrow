/**
 * Quote Reveal Animation
 * Handles scroll-triggered text reveal animations for quote sections
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Split text into words while preserving HTML structure
 * @param {HTMLElement} element - The element containing text to split
 * @returns {NodeList} List of word span elements
 */
export function splitTextIntoWords(element) {
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		null
	);

	const textNodes = [];
	let node;
	while (node = walker.nextNode()) {
		textNodes.push(node);
	}

	textNodes.forEach((textNode, textIndex) => {
		const parent = textNode.parentNode;
		let text = textNode.textContent;

		// Trim leading whitespace from first text node and trailing from last
		if (textIndex === 0) {
			// First node - remove leading whitespace
			text = text.replace(/^\s+/, '');
		}
		if (textIndex === textNodes.length - 1) {
			// Last node - remove trailing whitespace
			text = text.replace(/\s+$/, '');
		}

		if (text.length === 0) return;

		// Split by whitespace but preserve the spaces
		const parts = text.split(/(\s+)/);

		const fragment = document.createDocumentFragment();
		parts.forEach((part) => {
			if (part.length === 0) return;

			const span = document.createElement('span');

			if (part.match(/^\s+$/)) {
				// This is whitespace - preserve it but don't add the class for animation
				span.textContent = part;
				span.style.whiteSpace = 'pre';
			} else {
				// This is a word - add animation class
				span.className = 'quote-word';
				span.textContent = part;
			}

			fragment.appendChild(span);
		});

		parent.replaceChild(fragment, textNode);
	});

	return element.querySelectorAll('.quote-word');
}

/**
 * Initialize scroll reveal animation for a quote section
 * @param {string} sectionId - ID of the section element
 * @param {string} textId - ID of the text element
 * @param {string} pinContainerClass - CSS class of the pin container
 */
export function initQuoteReveal(sectionId, textId, pinContainerClass) {
	const section = document.getElementById(sectionId);
	const textElement = document.getElementById(textId);

	if (!section || !textElement) return;

	// Find the next sibling section dynamically
	let nextSection = section.nextElementSibling;
	while (nextSection && nextSection.tagName !== 'SECTION') {
		nextSection = nextSection.nextElementSibling;
	}

	// If no next section found, use the parent's next sibling or a fallback
	if (!nextSection) {
		nextSection = section.parentElement?.nextElementSibling;
	}

	const words = splitTextIntoWords(textElement);

	// Set initial state - all words at 10% opacity
	gsap.set(words, { opacity: 0.1, y: 20 });

	// Create scroll trigger configuration
	const scrollTriggerConfig = {
		trigger: section,
		start: 'center center',
		pin: `.${pinContainerClass}`,
		pinSpacing: true,
		scrub: true,
		markers: false // Set to true for debugging
	};

	// Set end trigger based on next section, or use scroll distance if no next section
	if (nextSection) {
		scrollTriggerConfig.endTrigger = nextSection;
		scrollTriggerConfig.end = 'top center';
	} else {
		// Fallback: use a scroll distance based on viewport height
		scrollTriggerConfig.end = `+=${window.innerHeight * 1.5}`;
	}

	// Create scroll trigger that pins the section and reveals words
	const revealTimeline = gsap.timeline({
		scrollTrigger: scrollTriggerConfig
	});

	// Animate each word with a stagger
	revealTimeline.to(words, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.03,
		ease: 'power2.out'
	});
}

/**
 * Initialize the main quote section with both paragraphs
 */
export function initMainQuoteSection() {
	const quoteSection = document.getElementById('quote-section');
	const quoteText = document.getElementById('quote-text');
	const quoteText3 = document.getElementById('quote-text-3');

	if (!quoteSection || !quoteText || !quoteText3) return;

	// Find the next sibling section dynamically
	let nextSection = quoteSection.nextElementSibling;
	while (nextSection && nextSection.tagName !== 'SECTION') {
		nextSection = nextSection.nextElementSibling;
	}

	if (!nextSection) {
		nextSection = quoteSection.parentElement?.nextElementSibling;
	}

	// Split both text elements into words
	const words1 = splitTextIntoWords(quoteText);
	const words2 = splitTextIntoWords(quoteText3);

	// Set initial state - first paragraph at 10% opacity, second at 0%
	gsap.set(words1, { opacity: 0.1, y: 20 });
	gsap.set(words2, { opacity: 0, y: 20 });

	// Create scroll trigger configuration - no pinning, just reveal as section scrolls
	const scrollTriggerConfig = {
		trigger: quoteSection,
		start: '20% 80%',
		end: '20% 20%',
		scrub: true,
		markers: false
	};

	// Create scroll trigger timeline
	const revealTimeline = gsap.timeline({
		scrollTrigger: scrollTriggerConfig
	});

	// Animate first paragraph (10% to 100%)
	revealTimeline.to(words1, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.03,
		ease: 'power2.out'
	});

	// Then animate second paragraph (0% to 100%)
	revealTimeline.to(words2, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.03,
		ease: 'power2.out'
	}, '-=0.2'); // Start slightly before first paragraph finishes
}

