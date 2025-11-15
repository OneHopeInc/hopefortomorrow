"use client";

import { useEffect, useRef, ReactNode, ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedInlineTextProps {
	children: ReactNode;
	className?: string;
	as?: ElementType;
	highlightColor?: string;
}

// Helper function to group words into lines based on their vertical position
function groupWordsIntoLines(
	wordElements: HTMLSpanElement[],
	container: HTMLElement
): HTMLSpanElement[][] {
	if (wordElements.length === 0) return [];

	const lines: HTMLSpanElement[][] = [];
	const lineMap = new Map<number, HTMLSpanElement[]>();
	
	// Use a more generous tolerance - account for line-height variations
	// Calculate based on the first word's height to be more adaptive
	const firstWordHeight = wordElements[0]?.getBoundingClientRect().height || 20;
	const tolerance = Math.max(firstWordHeight * 0.3, 8); // At least 30% of line height or 8px

	// Force a layout recalculation by accessing offsetTop
	wordElements[0]?.offsetTop;

	// Get container's bounding rect for relative positioning
	const containerRect = container.getBoundingClientRect();

	// Calculate positions for all words
	const wordPositions = wordElements.map((word) => {
		const wordRect = word.getBoundingClientRect();
		const relativeTop = wordRect.top - containerRect.top;
		const relativeLeft = wordRect.left - containerRect.left;
		return {
			word,
			top: relativeTop,
			left: relativeLeft,
			roundedTop: Math.round(relativeTop),
		};
	});

	// Group words by line
	wordPositions.forEach(({ word, roundedTop }) => {
		// Find existing line with similar top position
		let foundLine = false;
		for (const [lineTop] of lineMap) {
			if (Math.abs(roundedTop - lineTop) <= tolerance) {
				lineMap.get(lineTop)!.push(word);
				foundLine = true;
				break;
			}
		}

		// Create new line if no matching line found
		if (!foundLine) {
			lineMap.set(roundedTop, [word]);
		}
	});

	// Convert map to array, sort by top position, and sort words within each line by left position
	const sortedLines = Array.from(lineMap.entries())
		.sort((a, b) => a[0] - b[0])
		.map(([, words]) => {
			// Sort words within line by their left position (maintain reading order)
			return words.sort((a, b) => {
				const aLeft = a.getBoundingClientRect().left;
				const bLeft = b.getBoundingClientRect().left;
				return aLeft - bLeft;
			});
		});

	return sortedLines;
}

export default function AnimatedInlineText({
	children,
	className = "",
	as: Component = "span",
	highlightColor = "rgb(255, 255, 255)", // Default to blue, can be customized
}: AnimatedInlineTextProps) {
	const containerRef = useRef<HTMLElement>(null);
	const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
	const wordSpansRef = useRef<HTMLSpanElement[]>([]);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		
		// Don't process if there's no text content
		if (!container.textContent?.trim()) return;

		const textContent = container.textContent;
		
		// Ensure container allows wrapping but doesn't break words
		container.style.display = "inline";
		container.style.whiteSpace = "normal";
		container.style.wordBreak = "normal";
		container.style.overflowWrap = "normal";
		
		// Clean up existing ScrollTriggers and word spans
		scrollTriggersRef.current.forEach((trigger) => trigger.kill());
		scrollTriggersRef.current = [];
		wordSpansRef.current = [];

		// Split text into words while preserving whitespace
		const words = textContent.split(/(\s+)/);
		
		// Clear container content
		container.innerHTML = "";

		// Create a span for each word
		words.forEach((word, index) => {
			if (word.trim()) {
				// Create span for non-whitespace words
				const span = document.createElement("span");
				span.textContent = word;
				span.style.display = "inline-block";
				span.style.background = `linear-gradient(to right, rgb(124, 226, 185) 50%, ${highlightColor} 50%)`;
				span.style.backgroundSize = "200% 100%";
				span.style.backgroundPositionX = "100%";
				span.style.color = "transparent";
				span.style.backgroundClip = "text";
				span.style.webkitBackgroundClip = "text";
				span.style.whiteSpace = "nowrap"; // Prevent word breaking within a word
				span.style.wordBreak = "normal"; // Allow natural wrapping
				
				container.appendChild(span);
				wordSpansRef.current.push(span);
			} else if (word) {
				// Preserve whitespace (this allows wrapping between words)
				const whitespace = document.createTextNode(word);
				container.appendChild(whitespace);
			}
		});

		// Wait for layout to calculate line breaks
		const setupAnimations = () => {
			// Ensure all words have their initial state set first
			wordSpansRef.current.forEach((span) => {
				gsap.set(span, { backgroundPositionX: "100%" });
			});

			// Group words into lines based on their position
			const lines = groupWordsIntoLines(wordSpansRef.current, container);

			// Debug: log line detection (remove in production)
			if (lines.length > 1) {
				console.log(`Detected ${lines.length} lines`);
				lines.forEach((line, idx) => {
					console.log(`Line ${idx + 1}:`, line.map(w => w.textContent).join(' '));
				});
			}

			// Create ScrollTrigger animations for each line
			// Words in each line animate sequentially with delays to create a cascading effect
			lines.forEach((lineWords, lineIndex) => {
				if (lineWords.length === 0) return;

				// Use the first word as the trigger element for this line
				const triggerElement = lineWords[0];
				
				// Calculate the delay between words based on line length
				// Longer lines get smaller delays so all words animate within the scroll range
				const totalWords = lineWords.length;
				const delayBetweenWords = 0.1; // Delay in timeline units (0.1 = 10% of animation duration)
				
				// Create ONE timeline for this entire line
				// All words in the line will be added with sequential delays
				const lineTimeline = gsap.timeline({
					scrollTrigger: {
						trigger: triggerElement,
						scrub: true,
						start: "top center",
						end: "bottom center",
					},
				});

				// Add words to the timeline with sequential delays
				// Each word starts slightly after the previous one
				// This creates a cascading effect as you scroll
				lineWords.forEach((wordSpan, wordIndex) => {
					// Calculate position in timeline
					// First word starts at 0, each subsequent word has a delay
					const timelinePosition = wordIndex * delayBetweenWords;
					
					lineTimeline.to(
						wordSpan,
						{
							backgroundPositionX: "0%",
							ease: "none",
							duration: 0.3, // Short duration per word
						},
						timelinePosition // Sequential delay - words animate one after another
					);
				});

				// Store only ONE ScrollTrigger reference per line
				if (lineTimeline.scrollTrigger) {
					scrollTriggersRef.current.push(lineTimeline.scrollTrigger);
				}
			});
		};

		// Use requestAnimationFrame to wait for layout - need to wait for text to wrap
		// Use multiple RAFs and a small timeout to ensure layout is fully settled
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				// Small delay to ensure text wrapping has occurred
				setTimeout(() => {
					setupAnimations();
				}, 50);
			});
		});

		// Cleanup function
		return () => {
			scrollTriggersRef.current.forEach((trigger) => trigger.kill());
			scrollTriggersRef.current = [];
			wordSpansRef.current = [];
		};
	}, [children, highlightColor]);

	// Handle window resize - rebuild animations when layout changes
	useEffect(() => {
		const handleResize = () => {
			// Debounce resize to avoid too many recalculations
			if (containerRef.current) {
				// Clean up existing triggers
				scrollTriggersRef.current.forEach((trigger) => trigger.kill());
				scrollTriggersRef.current = [];

				// Recalculate lines and rebuild animations after resize
				setTimeout(() => {
					if (containerRef.current && wordSpansRef.current.length > 0) {
						// Reset background positions
						wordSpansRef.current.forEach((span) => {
							gsap.set(span, { backgroundPositionX: "100%" });
						});

						const lines = groupWordsIntoLines(wordSpansRef.current, containerRef.current);

						// Rebuild animations for each line with sequential delays
						lines.forEach((lineWords) => {
							if (lineWords.length === 0) return;

							const triggerElement = lineWords[0];
							const delayBetweenWords = 0.1;
							
							// Create timeline for this line
							const lineTimeline = gsap.timeline({
								scrollTrigger: {
									trigger: triggerElement,
									scrub: true,
									start: "top center",
									end: "bottom center",
								},
							});

							// Add words with sequential delays
							lineWords.forEach((wordSpan, wordIndex) => {
								lineTimeline.to(
									wordSpan,
									{
										backgroundPositionX: "0%",
										ease: "none",
										duration: 0.3,
									},
									wordIndex * delayBetweenWords
								);
							});

							if (lineTimeline.scrollTrigger) {
								scrollTriggersRef.current.push(lineTimeline.scrollTrigger);
							}
						});

						ScrollTrigger.refresh();
					}
				}, 100);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Render component with ref
	const ComponentWithRef = Component as any;
	
	return (
		<ComponentWithRef
			ref={containerRef}
			className={className}
			style={{ display: "inline", whiteSpace: "normal" }}
		>
			{children}
		</ComponentWithRef>
	);
}

