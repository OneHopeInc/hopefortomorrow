"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const lastScrollY = useRef(0);
	const ticking = useRef(false);
	const isScrolledRef = useRef(false);

	useEffect(() => {
		const handleScroll = () => {
			if (!ticking.current) {
				window.requestAnimationFrame(() => {
					const currentScrollY = window.scrollY;
					const scrollThreshold = 10; // Minimum scroll distance to trigger change
					
					// Only update if scroll distance is significant
					if (Math.abs(currentScrollY - lastScrollY.current) >= scrollThreshold) {
						const shouldBeScrolled = currentScrollY > 50; // Only shrink after scrolling past 50px
						
						if (shouldBeScrolled !== isScrolledRef.current) {
							isScrolledRef.current = shouldBeScrolled;
							setIsScrolled(shouldBeScrolled);
						}
						
						lastScrollY.current = currentScrollY;
					}
					
					ticking.current = false;
				});
				
				ticking.current = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Build breadcrumbs from pathname
	const pathSegments = pathname.split("/").filter(Boolean);
	const breadcrumbs = [
		{ label: "HOME", path: "/" },
		...pathSegments.map((segment, index) => {
			const path = "/" + pathSegments.slice(0, index + 1).join("/");
			// Format segment: convert kebab-case to ALL CAPS
			const label = segment
				.split("-")
				.map((word) => word.toUpperCase())
				.join(" ");
			return { label, path };
		}),
	];

	return (
		<nav
			className={`sticky top-0 z-50 w-full flex items-center justify-between bg-white border-b border-gray-200 transition-all duration-300 ${
				isScrolled
					? "px-6 py-2"
					: "px-6 py-4"
			}`}
		>
			{/* Breadcrumb Navigation */}
			<div
				className={`flex items-center gap-2 font-regular text-black/50 transition-all duration-300 ${
					isScrolled ? "text-sm" : "text-md"
				}`}
			>
				{breadcrumbs.map((crumb, index) => {
					const isActive = pathname === crumb.path;
					return (
						<div key={crumb.path} className="flex items-center gap-2">
							{index > 0 && <span className="text-black/50">/</span>}
							<Link
								href={crumb.path}
								className={`hover:text-black/70 transition-colors cursor-pointer ${
									isActive ? "font-semibold text-black/70" : ""
								}`}
							>
								{crumb.label}
							</Link>
						</div>
					);
				})}
			</div>

			{/* Logo */}
			<div
				className={`flex items-center transition-all duration-300 ${
					isScrolled ? "scale-[0.82]" : "scale-100"
				}`}
			>
				<Image
					src="/OneHopeBlack.png"
					alt="OneHope Logo"
					width={110}
					height={50}
					className="h-auto transition-all duration-300"
					priority
				/>
			</div>
		</nav>
	);
}

