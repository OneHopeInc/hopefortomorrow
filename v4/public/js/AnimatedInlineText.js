import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimatedInlineText({
	selector,
	animation = null,
	onScroll = null,
	splitOptions = {
		wordsClass: 'split-word',
		charsClass: 'split-char',
		reduceWhiteSpace: true,
	},
}) {
	const elements = document.querySelectorAll(selector);
	if (!elements.length) return;
	const highlightColor = animation.color || '#ffffff';
	const isGradient = highlightColor.includes('gradient') || highlightColor.includes('linear-gradient');
	const { wordsClass, charsClass, reduceWhiteSpace } = splitOptions;

	elements.forEach((element) => {
		// Get original text and preserve it for accessibility
		const originalText = element.textContent.trim();
		if (!originalText) return;

		// Split text into words, preserving natural word boundaries
		const textToSplit = reduceWhiteSpace 
			? originalText.replace(/\s+/g, ' ').trim()
			: originalText;
		const words = textToSplit.split(/\s+/).filter(word => word.length > 0);

		if (words.length === 0) return;

		// Split into words (with smartWrap) and characters
		element.innerHTML = words.map(word => {
			const chars = word.split('');
			return `<span class="${wordsClass}" style="display: inline-block; white-space: nowrap;">${chars.map(char => 
				`<span class="${charsClass}" style="display: inline-block;">${char}</span>`
			).join('')}</span>`;
		}).join(' ');

		const letters = element.querySelectorAll(`.${charsClass}`);
		if (!letters.length) return;
		const originalColor = window.getComputedStyle(element).color;

		// Build ScrollTrigger config - supports both enter/leave and start/end formats
		const buildScrollTriggerConfig = (additionalOptions = {}) => ({
			trigger: element,
			start: onScroll.enter,
			end: onScroll.leave,
			scrub: 1,
			markers: false
		});

		// Color animation timeline with scrub - sequential letter highlighting
		const colorTimeline = gsap.timeline({
			scrollTrigger: buildScrollTriggerConfig(),
		});

		if (isGradient) {
			// Extract colors from gradient (assuming linear-gradient format)
			const colorMatch = highlightColor.match(/#[0-9a-fA-F]{6}/g);
			const startColor = colorMatch ? colorMatch[0] : '#fb923c'; // orange
			const endColor = colorMatch && colorMatch.length > 1 ? colorMatch[1] : '#c084fc'; // purple
			
			// Helper function to convert hex to RGB
			const hexToRgb = (hex) => {
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			};
			
			// Helper function to interpolate between two colors
			const interpolateColor = (color1, color2, factor) => {
				const rgb1 = hexToRgb(color1);
				const rgb2 = hexToRgb(color2);
				if (!rgb1 || !rgb2) return color1;
				
				const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
				const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
				const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
				
				return `rgb(${r}, ${g}, ${b})`;
			};
			
			// For gradients, assign color based on position and animate reveal
			letters.forEach((letter, i) => {
				letter.style.color = originalColor;
				
				// Calculate position in phrase (0 to 1)
				const position = i / (letters.length - 1 || 1);
				
				// Interpolate color based on position
				const letterColor = interpolateColor(startColor, endColor, position);
				
				// Animate reveal from original color to gradient color
				const startProgress = i / letters.length;
				const endProgress = (i + 1) / letters.length;
				colorTimeline.to(letter, {
					color: letterColor,
					duration: endProgress - startProgress,
					ease: 'none',
				}, startProgress);
			});
		} else {
			// For solid colors, use regular color animation
			gsap.set(letters, { color: originalColor });

			// Animate each letter's color sequentially as you scroll
			const totalLetters = letters.length;
			letters.forEach((letter, i) => {
				const startProgress = i / totalLetters;
				const endProgress = (i + 1) / totalLetters;
				colorTimeline.to(letter, {
					color: highlightColor,
					duration: endProgress - startProgress,
					ease: 'none',
				}, startProgress);
			});
		}
	});
}
