import Link from 'next/link'
import { CalendarHeart } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CalendarHeart className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Doozy
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Discover and join exciting events happening in your area.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-sm text-muted-foreground hover:text-primary">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/my-events" className="text-sm text-muted-foreground hover:text-primary">
                                    My Events
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="text-sm text-muted-foreground hover:text-primary">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Contact</h3>
                        <ul className="space-y-2">
                            <li className="text-sm text-muted-foreground">
                                support@doozy.com
                            </li>
                            <li className="text-sm text-muted-foreground">
                                123 Event Street, City
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Doozy. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
