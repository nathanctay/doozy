import { cookies } from "next/headers"

import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { SearchHeader } from "@/components/search-header"
import { EventFilters } from "@/components/event-filters"
import { EventsLoading } from "@/components/events-loading"
import { EventGrid } from "@/components/event-grid"

interface PageProps {
    searchParams: {
        query?: string
        type?: string
        start_time?: string
        price?: string
        sort?: string
        page?: string
    }
}

export default async function EventsPage({ searchParams: params }: PageProps) {
    const supabase = await createClient()

    const searchParams = await params

    // Build the query
    let query = supabase.from("events").select("*", { count: "exact" })

    // Apply filters
    if (searchParams.query) {
        query = query.or(`
            title.ilike.%${searchParams.query}%,
            host.ilike.%${searchParams.query}%,
            start_time.ilike.%${searchParams.query}%
        `)
    }

    if (searchParams.type) {
        query = query.eq("event_type", searchParams.type)
    }

    if (searchParams.start_time) {
        const today = new Date()
        switch (searchParams.start_time) {
            case "today":
                query = query
                    .gte("start_time", today.toISOString().split("T")[0])
                    .lt("start_time", new Date(today.setDate(today.getDate() + 1)).toISOString().split("T")[0])
                break
            case "week":
                query = query
                    .gte("start_time", today.toISOString().split("T")[0])
                    .lt("start_time", new Date(today.setDate(today.getDate() + 7)).toISOString().split("T")[0])
                break
            case "month":
                query = query
                    .gte("start_time", today.toISOString().split("T")[0])
                    .lt("start_time", new Date(today.setMonth(today.getMonth() + 1)).toISOString().split("T")[0])
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
        case "start_time-asc":
            query = query.order("start_time", { ascending: true })
            break
        case "start_time-desc":
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
    console.log(events)

    if (error) {
        console.error("Error fetching events:", error)
    }

    // Get event types for filter
    const { data: eventTypes } = await supabase.from("event_types").select("event_type")
    console.log(eventTypes)
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

