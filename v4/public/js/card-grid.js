/**
 * Card Grid Component
 * Creates a grid of cards with title, subtitle on the left and image on the right
 */

/**
 * Renders a card grid component
 * @param {Object} options - Configuration options
 * @param {Array<Object>} options.cards - Array of card objects with title, subtitle, imageUrl, and optional href
 * @param {string} options.containerClass - Additional CSS classes for the container
 * @param {boolean} options.showPdfIcon - Whether to show PDF icon next to the arrow icon
 * @returns {string} HTML string for the card grid
 */
export function renderCardGrid({ cards = [], containerClass = '', showPdfIcon = false } = {}) {
	// Default to 8 cards with placeholder data if not provided
	const defaultCards = Array.from({ length: 8 }, (_, i) => ({
		title: `Card ${i + 1} Title`,
		subtitle: `Card ${i + 1} subtitle description`,
		imageUrl: 'https://via.placeholder.com/200x150/333333/FFFFFF?text=Placeholder'
	}));

	const cardsToRender = cards.length > 0 ? cards : defaultCards;

	// Array of border colors for hover effect (using full class names for Tailwind)
	const borderColors = [
		'hover:border-yellow-200/50',
		'hover:border-green-200/50',
		'hover:border-blue-200/50'
	];

	const cardsHTML = cardsToRender.map((card, index) => {
		const hoverBorder = borderColors[index % borderColors.length];
		
		// Use anchor tag if href is provided, otherwise use div
		const isLink = card.href && card.href !== '#';
		const Tag = isLink ? 'a' : 'div';
		const hrefAttr = isLink ? `href="${card.href}"` : '';
		// Check if it's an external link (starts with http:// or https://)
		const isExternal = isLink && (card.href.startsWith('http://') || card.href.startsWith('https://'));
		const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
		
		// Use cardImage if provided, otherwise fall back to default
		const cardImage = card.cardImage || '/assets/cardimage.png';
		
		return `
		<${Tag} ${hrefAttr} ${targetAttr} class="card-section bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-2 border-transparent ${hoverBorder} flex items-center justify-between gap-4">
			<div class="flex items-center gap-4 flex-1">
				<img 
					src="${cardImage}" 
					alt="${card.title}" 
					class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
				/>
				<div class="flex-1">
					<h3 class="text-white text-xl font-bold mb-2">${card.title}</h3>
					${card.subtitle ? `<p class="text-white/70 text-sm">${card.subtitle}</p>` : ''}
				</div>
			</div>
			<div class="flex items-center gap-2 flex-shrink-0">
				<img 
					src="${card.imageUrl}" 
					alt="${card.title}" 
					class="w-8 h-8 text-white"
					style="filter: brightness(0) invert(1);"
				/>
				${showPdfIcon ? `
				<img 
					src="/assets/file-text.svg" 
					alt="PDF" 
					class="w-8 h-8 text-white"
					style="filter: brightness(0) invert(1);"
				/>
				` : ''}
			</div>
		</${Tag}>
		`;
	}).join('');

	return `
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 ${containerClass}">
			${cardsHTML}
		</div>
	`;
}

/**
 * Renders the card grid and inserts it into a container element
 * @param {string} containerId - ID of the container element
 * @param {Object} options - Configuration options
 */
export function initCardGrid(containerId, options = {}) {
	const container = document.getElementById(containerId);
	if (!container) {
		console.error(`Container with ID "${containerId}" not found`);
		return;
	}

	container.innerHTML = renderCardGrid(options);
	
	// Ensure all cards have the transition property set and initial state
	const cards = container.querySelectorAll('.card-section');
	cards.forEach((card) => {
		// Explicitly set transition to ensure it works
		card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
		// Ensure initial state (CSS should handle this, but be explicit)
		if (!card.classList.contains('fade-in-visible')) {
			card.style.opacity = '0';
			card.style.transform = 'translateY(20px)';
		}
	});
	
	// Use requestAnimationFrame to ensure DOM is fully updated before initializing fade-in
	requestAnimationFrame(() => {
		// Re-initialize fade-in for newly created cards
		import('./card-fade-in.js').then(({ initCardFadeIn }) => {
			initCardFadeIn();
		});
	});
}
