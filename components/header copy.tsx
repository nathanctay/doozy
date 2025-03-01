"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarHeart, LogOut, UserIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { User } from '@supabase/supabase-js'
import { signOutAction } from "@/app/actions"
import { getUser } from "@/lib/auth-actions"

interface HeaderProps {
    user: User | null
}

export function Header({ user }: HeaderProps) {
    const pathname = usePathname()
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
                    {/* <Link href="/events/new" className="text-sm font-medium hover:text-primary">
                        Create Event
                    </Link> */}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8 border border-primary/20">
                                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {(user.user_metadata.name || user.email || "U").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex flex-col space-y-1 p-2">
                                    <p className="text-sm font-medium">{user.user_metadata.name || "User"}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-events">
                                        <CalendarHeart className="mr-2 h-4 w-4" />
                                        <span>My Events</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <button onClick={() => signOutAction()} className="flex w-full items-center">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
            </div>
        </header>
    )
}

