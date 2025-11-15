import Image from "next/image";
import { ReactNode } from "react";
import Section from "./Section";
import Button from "./Button";

interface HeroHomeProps {
	logo?: string;
	title: ReactNode;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
	backgroundImage?: string;
}

export default function HeroHome({
	logo = "/logo.svg",
	title,
	subtitle,
	buttonText,
	buttonHref,
	backgroundImage = "/bgimage.png",
}: HeroHomeProps) {
	return (
		<Section className="relative h-screen flex items-start pt-20 justify-center">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src={backgroundImage}
					alt="Background"
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Content Overlay */}
			<div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
				{/* Logo */}
				<div className="mb-8">
					<Image
						src={logo}
						alt="Logo"
						width={800}
						height={300}
						className="max-w-[500px]"
						priority
					/>
				</div>

				{/* Title */}
				<div className="mb-4">
					<h3 className="text-2xl md:text-3xl lg:text-3xl font-light text-white leading-relaxed max-w-[550px]">
						{title}
					</h3>
				</div>

				{/* Subtitle */}
				{subtitle && (
					<div className="mb-8">
						<p className="text-base md:text-lg lg:text-xl font-light opacity-90 text-white">
							{subtitle}
						</p>
					</div>
				)}

				{/* Button */}
				{buttonText && (
					<div>
						<Button
							href={buttonHref}
							variant="primary"
							size="md"
						>
							{buttonText}
						</Button>
					</div>
				)}
			</div>
		</Section>
	);
}

