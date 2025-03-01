"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

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
    const params = useSearchParams()
    const pathname = usePathname()
    const [date, setDate] = useState<Date | undefined>(searchParams.date ? new Date(searchParams.date) : undefined)

    const updateFilter = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(params.toString())

        if (!value || value === "all") {
            newParams.delete(key)
        } else {
            newParams.set(key, value)
        }

        newParams.set("page", "1")
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
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
        setDate(undefined)
    }

    const hasFilters = params.has("type") || params.has("date") || params.has("price")

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            updateFilter("date", null)
            return
        }

        const formattedDate = format(date, "yyyy-MM-dd")
        updateFilter("date", formattedDate)
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
                    <Select
                        value={params.get("type") || "all"}
                        onValueChange={(value) => updateFilter("type", value)}
                    >
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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {params.get("date") && /^\d{4}-\d{2}-\d{2}$/.test(params.get("date")!) ? (
                                    format(new Date(`${params.get("date")}T00:00:00`), "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={params.get("date") && /^\d{4}-\d{2}-\d{2}$/.test(params.get("date")!)
                                    ? new Date(`${params.get("date")}T00:00:00`)
                                    : undefined}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {date && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => handleDateSelect(undefined)}
                        >
                            <X className="mr-2 h-3 w-3" />
                            Clear date
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Select value={searchParams.price || ""} onValueChange={(value) => updateFilter("price", value)}>
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

