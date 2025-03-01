"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface EventFiltersProps {
    eventTypes: string[]
    searchParams: {
        type?: string
        date?: string
        price?: string
        [key: string]: string | undefined
    }
}

export function EventFilters({ eventTypes, searchParams }: EventFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    console.log(pathname)
    const params = useSearchParams()

    const updateFilter = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(params.toString())
        if (value && !['all', 'any'].includes(value)) {
            newParams.set(key, value)
        } else {
            newParams.delete(key)
        }
        newParams.set("page", "1")
        router.push(`${pathname}?${newParams.toString()}`)
    }

    const clearFilters = () => {
        const newParams = new URLSearchParams()
        if (params.has("query")) {
            newParams.set("query", params.get("query")!)
        }
        if (params.has("sort")) {
            newParams.set("sort", params.get("sort")!)
        }
        router.push(`${pathname}?${newParams.toString()}`)
    }

    const hasFilters = params.has("type") || params.has("date") || params.has("price")

    // Helper function to get the current value or default
    const getCurrentValue = (key: 'type' | 'date' | 'price') => {
        const value = params.get(key)
        return value || ''
    }

    return (
        <Card className="sticky top-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Filters</CardTitle>
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear all
                    </Button>
                )}
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type</label>
                    <Select value={getCurrentValue('type')} onValueChange={(value) => updateFilter("type", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            {eventTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Select value={getCurrentValue('date')} onValueChange={(value) => updateFilter("date", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any date</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This week</SelectItem>
                            <SelectItem value="month">This month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Select value={getCurrentValue('price')} onValueChange={(value) => updateFilter("price", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any price</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}

