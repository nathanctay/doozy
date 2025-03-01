import { EventGrid } from "@/components/event-grid"
import { EventFilters } from "@/components/event-filters"
import { SearchHeader } from "@/components/search-header"
import { Suspense } from "react"
import { EventsLoading } from "@/components/events-loading"
import { createClient } from "@/utils/supabase/server"
import { getUser } from "@/lib/auth-actions"

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

export default async function EventsPage({ searchParams: params }: PageProps) {
    const supabase = await createClient()
    const user = await getUser()
    const searchParams = await params
    // Near the start of your page component, add a default sort if none exists
    const sortParam = searchParams.sort || "score"

    // Build the query
    let query = supabase
        .from("events")
        .select("*", { count: "exact" })
        .gte('end_time', new Date().toISOString().split('T')[0]) // Compare just the date part
    // Alternatively, if you want to be precise with time:
    // .gte('end_time', new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString())


    // Apply filters
    if (searchParams.query) {
        query = query.ilike("title", `%${searchParams.query}%`)
    }

    if (searchParams.type) {
        query = query.eq("event_type", searchParams.type)
    }

    if (searchParams.date) {
        try {
            // Check if the date matches YYYY-MM-DD format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(searchParams.date)) {
                console.error("Invalid date format:", searchParams.date)
            } else {
                // Parse the date in YYYY-MM-DD format and create local midnight timestamps
                const selectedDate = new Date(`${searchParams.date}T00:00:00`)
                const nextDate = new Date(`${searchParams.date}T00:00:00`)
                nextDate.setDate(nextDate.getDate() + 1)

                query = query.gte("start_time", selectedDate.toISOString())
                    .lt("start_time", nextDate.toISOString())
            }
        } catch (error) {
            console.error("Error processing date:", error, searchParams.date)
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
            query = query.order("score", { ascending: false })
            break
        default:
            query = query.order("score", { ascending: false })
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
                                user={user}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    )
}

