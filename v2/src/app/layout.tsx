import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
	subsets: ["latin"],
	variable: "--font-inter-tight",
});

export const metadata: Metadata = {
	title: "Hello World",
	description: "A simple hello world app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={interTight.variable}>
			<body className={interTight.className}>{children}</body>
		</html>
	);
}
