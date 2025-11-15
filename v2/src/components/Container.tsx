import { ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "full";
	className?: string;
}

export default function Container({
	children,
	size = "md",
	className = "",
}: ContainerProps) {
	const sizeClasses = {
		sm: "max-w-[600px]",
		md: "max-w-[750px]",
		lg: "max-w-[900px]",
		full: "max-w-[900px]",
	};

	return (
		<div
			className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
		>
			{children}
		</div>
	);
}

