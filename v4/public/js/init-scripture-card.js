import { renderScriptureCard, initScriptureReveal } from '/js/scripture-reveal.js';
import { getLessonScriptureData } from '/js/scripture-data.js';

/**
 * Initialize a scripture card for a lesson using shared data.
 * @param {Object} config
 * @param {string} config.lessonId - Lesson identifier used to look up scripture data.
 * @param {string} [config.containerId='scripture-reading-container'] - Target element ID for rendering the card.
 * @param {string} [config.cardId] - Override the default card ID.
 * @param {Object} [config.revealOptions] - Options forwarded to initScriptureReveal (markers, start, end, etc.).
 */
export function initLessonScriptureCard({
	lessonId,
	containerId = 'scripture-reading-container',
	cardId,
	revealOptions = {}
}) {
	if (!lessonId) {
		console.warn('initLessonScriptureCard requires a lessonId');
		return;
	}

	const data = getLessonScriptureData(lessonId);
	if (!data) {
		console.warn(`No scripture data found for lesson "${lessonId}"`);
		return;
	}

	const container = document.getElementById(containerId);
	if (!container) {
		console.warn(`Container with ID "${containerId}" not found`);
		return;
	}

	const finalCardId = cardId || data.cardId || `${lessonId}-scripture-card`;

	container.innerHTML = renderScriptureCard({
		id: finalCardId,
		verse: data.verse,
		text: data.text
	});

	initScriptureReveal(finalCardId, revealOptions);
}

