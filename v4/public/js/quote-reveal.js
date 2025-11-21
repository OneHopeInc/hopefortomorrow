/**
 * Quote Reveal Animation
 * Handles scroll-triggered text reveal animations for quote sections
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Split text into words while preserving HTML structure
 */
function splitTextIntoWords(element) {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
	const textNodes = [];
	let node;
	
	while ((node = walker.nextNode())) {
		textNodes.push(node);
	}

	textNodes.forEach((textNode, textIndex) => {
		const parent = textNode.parentNode;
		let text = textNode.textContent;

		// Trim whitespace from first/last nodes
		if (textIndex === 0) text = text.replace(/^\s+/, '');
		if (textIndex === textNodes.length - 1) text = text.replace(/\s+$/, '');
		if (text.length === 0) return;

		const parts = text.split(/(\s+)/);
		const fragment = document.createDocumentFragment();

		parts.forEach((part) => {
			if (part.length === 0) return;

			if (part.match(/^\s+$/)) {
				// Use text nodes for whitespace to allow proper wrapping in Safari
				fragment.appendChild(document.createTextNode(part));
			} else {
				const span = document.createElement('span');
				span.className = 'quote-word';
				span.textContent = part;
				// Keep words intact - prevent breaking within words, but allow wrapping at word boundaries
				span.style.display = 'inline';
				span.style.wordBreak = 'normal';
				span.style.overflowWrap = 'normal';
				fragment.appendChild(span);
			}
		});

		parent.replaceChild(fragment, textNode);
	});

	return element.querySelectorAll('.quote-word');
}

/**
 * Initialize scroll reveal animation for a quote section
 */
export function initQuoteReveal(sectionId, textId, pinContainerClass) {
	const section = document.getElementById(sectionId);
	const textElement = document.getElementById(textId);
	if (!section || !textElement) return;

	// Find next section
	let nextSection = section.nextElementSibling;
	while (nextSection && nextSection.tagName !== 'SECTION') {
		nextSection = nextSection.nextElementSibling;
	}
	if (!nextSection) {
		nextSection = section.parentElement?.nextElementSibling;
	}

	const words = splitTextIntoWords(textElement);
	gsap.set(words, { opacity: 0.1, y: 20 });

	const config = {
		trigger: section,
		start: 'center center',
		pin: `.${pinContainerClass}`,
		pinSpacing: true,
		scrub: true,
		markers: false
	};

	if (nextSection) {
		config.endTrigger = nextSection;
		config.end = 'top center';
	} else {
		config.end = `+=${window.innerHeight * 1.5}`;
	}

	gsap.timeline({ scrollTrigger: config }).to(words, {
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

	const words1 = splitTextIntoWords(quoteText);
	const words2 = splitTextIntoWords(quoteText3);
	gsap.set([words1, words2], { opacity: 0, y: 20 });

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: quoteSection,
			start: '20% 80%',
			end: '20% 20%',
			scrub: true,
			markers: false
		}
	});

	timeline
		.to(words1, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			stagger: 0.03,
			ease: 'power2.out'
		})
		.to(words2, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			stagger: 0.03,
			ease: 'power2.out'
		}, '-=0.2');
}

/**
 * Initialize quote-text-4 with same setup as home page but adjusted scroll markers
 */
export function initQuoteText4() {
	const quoteSection = document.getElementById('quote-section');
	const quoteText = document.getElementById('quote-text-4');
	if (!quoteSection || !quoteText) return;

	const words = splitTextIntoWords(quoteText);
	gsap.set(words, { opacity: 0, y: 20 });

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: quoteSection,
			start: 'center 60%', // Adjusted: start when top of section reaches 90% of viewport
			end: 'center 40%',   // Adjusted: end when top of section reaches 30% of viewport
			scrub: true,
			markers: false
		}
	});

	timeline.to(words, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.03,
		ease: 'power2.out'
	});
}

