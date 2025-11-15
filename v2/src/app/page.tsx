"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroHome from "@/components/HeroHome";

export default function Home() {
	const root = useRef<HTMLDivElement>(null);

	return (
		<div ref={root} className="min-h-screen">
			<Navbar />
			<HeroHome
				title={
					<>
						Invite teens into a{" "}
						<span className="font-semibold">
							deeper relationship with Jesus{" "}
						</span>
						as they apply God&apos;s Word to{" "}
						<span className="font-semibold">real life issues</span>
					</>
				}
				subtitle="Resources designed for the Values Education Program"
				buttonText="RESOURCES"
				buttonHref="/resources"
			/>
		</div>
	);
}
