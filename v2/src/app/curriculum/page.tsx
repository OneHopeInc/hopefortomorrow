import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Curriculum() {
	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-4">
				<h1 className="text-4xl font-bold">Curriculum Page</h1>
				<Link
					href="/curriculum/lesson-1"
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mt-4"
				>
					Go to Lesson 1
				</Link>
			</div>
		</div>
	);
}

