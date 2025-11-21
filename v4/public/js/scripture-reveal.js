/**
 * Scripture Reveal Component
 * Handles rendering and scroll-triggered text reveal animations for scripture sections
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
				fragment.appendChild(document.createTextNode(part));
			} else {
				const span = document.createElement('span');
				span.className = 'scripture-word';
				span.textContent = part;
				// Keep words intact - prevent breaking within words, but allow wrapping at word boundaries
				span.style.wordBreak = 'normal';
				span.style.overflowWrap = 'normal';
				fragment.appendChild(span);
			}
		});

		parent.replaceChild(fragment, textNode);
	});

	return element.querySelectorAll('.scripture-word');
}

/**
 * Renders a scripture card HTML string
 * @param {Object} options - Configuration options
 * @param {string} options.id - Unique ID for the scripture card
 * @param {string} options.verse - Verse reference (e.g., "Luke 5:1-11 (NLT)")
 * @param {string|Array<string>} options.text - Scripture text as string or array of paragraphs
 * @returns {string} HTML string for the scripture card
 */
export function renderScriptureCard({ id, verse, text }) {
	const paragraphs = Array.isArray(text) ? text : [text];
	
	const paragraphsHTML = paragraphs.map((para, index) => {
		const isLast = index === paragraphs.length - 1;
		// Allow HTML in paragraphs (for jesus-speaks spans)
		// Add inline styles for mobile text wrapping - wrap words, don't break them
		return `<p class="scripture-text text-lg leading-relaxed break-words ${isLast ? '' : 'mb-4'}" style="word-break: normal; overflow-wrap: break-word; max-width: 100%;">${para}</p>`;
	}).join('\n\t\t\t\t\t\t');

	return `
		<!-- Scripture Reading Card -->
		<div id="${id}" class="bg-yellow-200/5 p-6 rounded-xl mb-6 border-2 border-yellow-200/15 overflow-hidden w-full max-w-full">
			<style>
				#${id} .jesus-speaks {
					display: inline;
					word-break: normal;
					overflow-wrap: normal;
					white-space: normal;
				}
			</style>
			<h3 class="text-2xl font-bold text-yellow-200 mb-4 break-words">Read: ${verse}</h3>
			<div class="w-full max-w-full overflow-hidden">
				${paragraphsHTML}
			</div>
		</div>
	`;
}

/**
 * Initialize scroll reveal animation for a scripture card
 * @param {string} cardId - ID of the scripture card element
 * @param {Object} options - Optional configuration
 * @param {Object} options.start - ScrollTrigger start position (default: 'center 80%')
 * @param {Object} options.end - ScrollTrigger end position (default: 'center 20%')
 * @param {number} options.stagger - Stagger delay between words (default: 0.03)
 */
export function initScriptureReveal(cardId, options = {}) {
	const scriptureCard = document.getElementById(cardId);
	if (!scriptureCard) {
		console.warn(`Scripture card with ID "${cardId}" not found`);
		return;
	}

	const scriptureTexts = scriptureCard.querySelectorAll('.scripture-text');
	if (scriptureTexts.length === 0) {
		console.warn(`No scripture text found in card "${cardId}"`);
		return;
	}

	// Split each paragraph into words and track which are Jesus's words
	const allWords = [];
	const wordToColor = new Map(); // Map to store target color for each word
	
	scriptureTexts.forEach((textElement) => {
		const words = splitTextIntoWords(textElement);
		allWords.push(...words);
		
		// Determine target color for each word
		words.forEach((word) => {
			// Check if word is inside a jesus-speaks element
			let parent = word.parentElement;
			let isJesusWord = false;
			while (parent && parent !== scriptureCard) {
				if (parent.classList.contains('jesus-speaks')) {
					isJesusWord = true;
					break;
				}
				parent = parent.parentElement;
			}
			
			// Store target color for this word
			wordToColor.set(word, isJesusWord ? 'rgb(253, 217, 98)' : 'rgb(255, 255, 255)'); // red-400 or yellow-300
		});
	});

	// Set initial state: white with opacity, slight y offset
	gsap.set(allWords, { 
		color: 'rgba(255, 255, 255, 0.7)',
		opacity: 0.7,
		y: 20 
	});

	// Find next section for end trigger
	let nextSection = scriptureCard.parentElement?.nextElementSibling;
	while (nextSection && nextSection.tagName !== 'SECTION' && !nextSection.classList.contains('bg-white/5')) {
		nextSection = nextSection.nextElementSibling;
	}

	const config = {
		trigger: scriptureCard,
		start: options.start || 'center bottom',
		end: options.end || 'top 68%',
		scrub: true,
		markers: options.markers ?? false
	};

	if (nextSection && !options.end) {
		config.endTrigger = nextSection;
		config.end = 'top 68%';
	} else if (options.endTrigger) {
		config.endTrigger = options.endTrigger;
		config.end = options.end || 'top center';
	}

	// Animate all words together with their individual target colors
	gsap.timeline({ scrollTrigger: config }).to(allWords, {
		opacity: 0.9,
		y: 0,
		duration: 1,
		stagger: options.stagger || 0.03,
		ease: 'power2.out',
		// Use a function to set color for each word based on whether it's a Jesus word
		color: function(index, target) {
			return wordToColor.get(target) || 'rgb(253, 224, 71)'; // Default to yellow if not found
		}
	});
}

/**
 * Initialize all scripture cards on the page
 * Automatically finds all elements with class 'scripture-card' and initializes them
 */
export function initAllScriptureReveals() {
	const scriptureCards = document.querySelectorAll('[class*="scripture-reading-card"], [id^="scripture-"]');
	scriptureCards.forEach((card) => {
		if (card.id) {
			initScriptureReveal(card.id);
		}
	});
}

