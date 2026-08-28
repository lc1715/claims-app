'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Navbar() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-semibold">Healthcare Claims</Link>

                <div className="flex items-center gap-6">
                    {userId && (
                        <Link href={`/claims?userId=${userId}`} className="text-gray-600 hover:text-gray-900">Claims</Link>
                    )}

                    {userId && (
                        <Link href="/" className="text-gray-600 hover:text-gray-900">Switch User</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;