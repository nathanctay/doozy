import Link from "next/link"
import { notFound } from "next/navigation"
import { AttendButton } from "@/components/attend-button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatDate, formatTime } from "@/lib/utils"
import { CalendarDays, ExternalLink, MapPin, User, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { getUser } from "@/lib/auth-actions"

export default async function EventPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const id = (await params).id
    // Fetch the event details
    const { data: event, error } = await supabase
        .from("events")
        .select(`
      *,
      attendees:event_attendees(
        user_id,
        profiles(id, name)
      )
    `)
        .eq("id", id)
        .single()

    if (error || !event) {
        console.error("Error fetching event:", error)
        notFound()
    }

    // Get current user
    const user = await getUser()

    // Check if user is already attending
    const isAttending = event.attendees.some((attendee: any) => attendee.user_id === user?.id)

    function formatTimeRange(startTime: string, endTime: string): string {
        const start = new Date(startTime)
        const end = new Date(endTime)

        const startDateFormatted = formatDate(startTime)
        const endDateFormatted = formatDate(endTime)
        const startFormatted = formatTime(startTime)
        const endFormatted = formatTime(endTime)

        // If dates are different, show both dates
        if (startDateFormatted !== endDateFormatted) {
            return `${startDateFormatted} ${startFormatted} - ${endDateFormatted} ${endFormatted}`
        }

        // If same date, show just one date
        return `${startDateFormatted} ${startFormatted} - ${endFormatted}`
    }

    function isOngoing(startTime: string, endTime: string): boolean {
        const start = new Date(startTime + 'Z') // Append Z to treat as UTC
        const end = new Date(endTime + 'Z')     // Append Z to treat as UTC
        const now = new Date()
        const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000) // Convert to UTC

        return nowUTC >= start && nowUTC <= end
    }

    return (
        <main className="container mx-auto py-6 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/events" className="text-primary hover:underline">
                        &larr; Back to events
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <Badge className="mb-2 bg-secondary hover:bg-secondary/80">{event.event_type}</Badge>
                        <h1 className="text-3xl font-bold">{event.title}</h1>
                        <div className="text-muted-foreground">Hosted by {event.host || "Anonymous"}</div>
                    </div>

                    <AttendButton eventId={event.id} attendees_count={event.attendees_count} isAttending={isAttending} userId={user?.id} />
                </div>

                <Card className="p-6 mb-8 border-primary/20">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-start">
                            <CalendarDays className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                            <div>
                                <h3 className="font-medium">Date and Time</h3>
                                <p>{formatTimeRange(event.start_time, event.end_time)}</p>
                                {isOngoing(event.start_time, event.end_time) && (
                                    <Badge variant="default" className="mt-2">
                                        Happening now
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                            <div>
                                <h3 className="font-medium">Location</h3>
                                <p>{event.location.toLowerCase() !== 'none' ? event.location : event.host}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="h-5 w-5 mr-3 mt-0.5 text-primary">$</div>
                            <div>
                                <h3 className="font-medium">Cost</h3>
                                <p>{typeof event.cost === "number" ? event.cost === 0 ? "Free" : `$${event.cost.toFixed(2)}` : 'Unknown'}</p>
                            </div>
                        </div>

                        {event.website && (
                            <div className="flex items-start">
                                <ExternalLink className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                                <div>
                                    <h3 className="font-medium">Website</h3>
                                    <a
                                        href={event.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Visit event website
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">About this event</h2>
                    <div className="prose max-w-none">
                        <p>{event.description}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Users className="mr-2 h-5 w-5 text-accent" />
                        Attendees{" "}
                        {user ? (
                            `(${event.attendees.length})`
                        ) : (
                            <span className="inline-flex items-center">
                                (
                                <span className="bg-muted-foreground/20 blur-[6px] text-zinc-600 select-none" aria-hidden="true">
                                    00
                                </span>
                                )<span className="sr-only">Sign in to view number of attendees</span>
                            </span>
                        )}
                    </h2>

                    {user ? (
                        event.attendees.length > 0 ? (
                            <div className="grid gap-2">
                                {event.attendees.map((attendee: any) => (
                                    <div
                                        key={attendee.user_id}
                                        className="flex items-center p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-md"
                                    >
                                        <User className="h-5 w-5 mr-2 text-primary" />
                                        <span>{attendee.profiles?.name || "Anonymous User"}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Be the first to attend this event!</p>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            <p className="text-muted-foreground">
                                <Link
                                    href={{
                                        pathname: "/login",
                                        query: { redirect: `/events/${params.id}` },
                                    }}
                                    className="text-primary hover:underline"
                                >
                                    Sign in
                                </Link>
                                &nbsp;to view attendees</p>
                            {/* <Button asChild>
                                <Link
                                    href={{
                                        pathname: "/login",
                                        query: { redirect: `/events/${params.id}` },
                                    }}
                                >
                                    Sign in
                                </Link>
                            </Button> */}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

