import type React from "react"
import Link from "next/link"
import { CalendarHeart } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Content */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <CalendarHeart className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Doozy
                        </span>
                    </Link>
                    {children}
                </div>
            </div>

            {/* Background */}
            <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <blockquote className="space-y-2">
                        <p className="text-lg">&ldquo;The best way to predict the future is to create it.&rdquo;</p>
                        <footer className="text-sm">Peter Drucker</footer>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}

