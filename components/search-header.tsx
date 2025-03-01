"use client"

import type React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"

export function SearchHeader() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [query, setQuery] = useState(searchParams.get("query") || "")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (query) {
            params.set("query", query)
        } else {
            params.delete("query")
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", value)
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="flex-1 w-full">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search events..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                        <Select defaultValue={searchParams.get("sort") || "popular"} onValueChange={handleSort}>
                            <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">Most popular</SelectItem>
                                <SelectItem value="date-asc">Date: Earliest first</SelectItem>
                                <SelectItem value="date-desc">Date: Latest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

