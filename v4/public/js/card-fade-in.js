/**
 * Card Fade-In Animation
 * Handles scroll-triggered fade-in animations for card sections
 */
export function initCardFadeIn() {
	const cardSections = document.querySelectorAll('.card-section');
	if (cardSections.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Remove inline styles to let CSS handle the transition
					entry.target.style.opacity = '';
					entry.target.style.transform = '';
					// Use requestAnimationFrame to ensure smooth transition
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							entry.target.classList.add('fade-in-visible');
						});
					});
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		}
	);

	cardSections.forEach((section, index) => {
		// Only observe cards that aren't already visible
		if (!section.classList.contains('fade-in-visible')) {
			// Check if card is already in viewport
			const rect = section.getBoundingClientRect();
			const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
			
			if (isInViewport) {
				// Card is already in view, add staggered delay for smooth fade-in
				setTimeout(() => {
					// Remove inline styles to let CSS handle the transition
					section.style.opacity = '';
					section.style.transform = '';
					// Use double requestAnimationFrame to ensure transition works
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							section.classList.add('fade-in-visible');
						});
					});
				}, 200 + (index * 100)); // Staggered fade-in: 200ms base + 100ms per card
			} else {
				// Card is not in view, observe normally
				observer.observe(section);
			}
		}
	});
}

