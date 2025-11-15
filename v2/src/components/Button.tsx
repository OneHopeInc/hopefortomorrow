import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	href?: string;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	className?: string;
	type?: "button" | "submit" | "reset";
}

export default function Button({
	children,
	href,
	onClick,
	variant = "primary",
	size = "md",
	className = "",
	type = "button",
}: ButtonProps) {
	const baseClasses = "inline-block text-center font-semibold transition-colors cursor-pointer";
	
	const variantClasses = {
		primary: "bg-transparent text-white border-2 border-white/50 rounded-2xl hover:bg-white hover:text-black",
		secondary: "bg-black text-white hover:bg-gray-800",
		outline: "border-2 border-white text-white hover:bg-white hover:text-black",
	};

	const sizeClasses = {
		sm: "px-4 py-1 text-sm",
		md: "px-6 py-2 text-base",
		lg: "px-8 py-4 text-lg",
	};

	const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

	if (href) {
		return (
			<Link href={href} className={combinedClasses}>
				{children}
			</Link>
		);
	}

	return (
		<button type={type} onClick={onClick} className={combinedClasses}>
			{children}
		</button>
	);
}

