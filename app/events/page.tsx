import { cookies } from "next/headers"
import { EventGrid } from "@/components/event-grid"
import { EventFilters } from "@/components/event-filters"
import { SearchHeader } from "@/components/search-header"
import { Suspense } from "react"
import { EventsLoading } from "@/components/events-loading"
import { createClient } from "@/utils/supabase/server"

interface PageProps {
    searchParams: {
        query?: string
        type?: string
        date?: string
        price?: string
        sort?: string
        page?: string
    }
}

export default async function EventsPage({ searchParams }: PageProps) {
    const supabase = await createClient()

    // Build the query
    let query = supabase.from("events").select("*", { count: "exact" })

    // Apply filters
    if (searchParams.query) {
        query = query.ilike("title", `%${searchParams.query}%`)
    }

    if (searchParams.type) {
        query = query.eq("event_type", searchParams.type)
    }

    if (searchParams.date) {
        const now = new Date()
        switch (searchParams.date) {
            case "today":
                const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString()
                const todayEnd = new Date(now.setHours(23, 59, 59, 999)).toISOString()
                query = query.gte("start_time", todayStart).lte("start_time", todayEnd)
                break
            case "week":
                const weekEnd = new Date(now)
                weekEnd.setDate(weekEnd.getDate() + 7)
                query = query.gte("start_time", now.toISOString()).lt("start_time", weekEnd.toISOString())
                break
            case "month":
                const monthEnd = new Date(now)
                monthEnd.setMonth(monthEnd.getMonth() + 1)
                query = query.gte("start_time", now.toISOString()).lt("start_time", monthEnd.toISOString())
                break
        }
    }

    if (searchParams.price) {
        switch (searchParams.price) {
            case "free":
                query = query.eq("cost", 0)
                break
            case "paid":
                query = query.gt("cost", 0)
                break
        }
    }

    // Apply sorting
    switch (searchParams.sort) {
        case "date-asc":
            query = query.order("start_time", { ascending: true })
            break
        case "date-desc":
            query = query.order("start_time", { ascending: false })
            break
        case "popular":
            query = query.order("attendees_count", { ascending: false })
            break
        default:
            query = query.order("start_time", { ascending: true })
    }

    // Apply pagination
    const page = Number.parseInt(searchParams.page || "1")
    const pageSize = 12
    const start = (page - 1) * pageSize

    query = query.range(start, start + pageSize - 1)

    // Execute query
    const { data: events, count, error } = await query

    if (error) {
        console.error("Error fetching events:", error)
    }

    // Get event types for filter
    const { data: eventTypes } = await supabase.from("event_types").select("event_type")

    const uniqueEventTypes = eventTypes?.map((e) => e.event_type) || []

    return (
        <main className="min-h-screen">
            <SearchHeader />

            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-64 shrink-0">
                        <EventFilters eventTypes={uniqueEventTypes} searchParams={searchParams} />
                    </aside>

                    <div className="flex-1">
                        <Suspense fallback={<EventsLoading />}>
                            <EventGrid
                                events={events || []}
                                totalEvents={count || 0}
                                currentPage={page}
                                pageSize={pageSize}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    )
}

