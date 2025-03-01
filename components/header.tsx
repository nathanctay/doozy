"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { CalendarHeart, LogOut, Menu, UserIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { User } from '@supabase/supabase-js'
import { signOutAction } from "@/app/actions"
import { useState } from "react"

interface HeaderProps {
    user: User | null
}

export function Header({ user }: HeaderProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between py-4">
                <Link href="/" className="flex items-center gap-2">
                    <CalendarHeart className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Doozy
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary">
                        Home
                    </Link>
                    <Link href="/events" className="text-sm font-medium hover:text-primary">
                        Browse Events
                    </Link>
                    {user && (
                        <Link href="/my-events" className="text-sm font-medium hover:text-primary">
                            My Events
                        </Link>
                    )}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile">
                                <Avatar className="h-8 w-8 border border-primary/20">
                                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.name || "User"} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {(user.user_metadata.name || user.email || "U").charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link
                                    href={{
                                        pathname: "/login",
                                        query: { redirect: pathname },
                                    }}
                                >
                                    Log in
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link
                                    href={{
                                        pathname: "/register",
                                        query: { redirect: pathname },
                                    }}
                                >
                                    Sign up
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            {user && (
                                <div className="flex items-center gap-4 pb-4">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {(user.user_metadata.name || user.email || "U").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <SheetTitle className="text-left">{user.user_metadata.name || "User"}</SheetTitle>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <Link
                                href="/"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >                                Home
                            </Link>
                            <Link
                                href="/events"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >                                Browse Events
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        href="/my-events"
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        My Events
                                    </Link>
                                    <Separator />
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <button onClick={() => signOutAction()} className="flex w-full items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/90 transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Separator />
                                    <div className="grid gap-2">
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={{
                                                    pathname: "/login",
                                                    query: { redirect: pathname },
                                                }}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Log in
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link
                                                href={{
                                                    pathname: "/register",
                                                    query: { redirect: pathname },
                                                }}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Sign up
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header >
    )
}

