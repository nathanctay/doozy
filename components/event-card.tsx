import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Flame, MapPin, Users } from "lucide-react"
import { formatTimeRange, getEventStatus, formatDate } from "@/lib/utils"

interface EventCardProps {
    event: {
        id: string
        title: string
        description: string
        start_time: string
        end_time: string
        location: string
        event_type: string
        attendees_count: number
        score: number
    }
}

export function EventCard({ event }: EventCardProps) {
    const status = getEventStatus(event.start_time, event.end_time)

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC"
        });
    };

    return (
        <Card className="h-full hover:shadow-md transition-shadow overflow-hidden border-primary/20">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
            <CardContent className="pt-6">
                <div className="flex gap-2 mb-2">
                    <Badge className="bg-secondary hover:bg-secondary/80">{event.event_type}</Badge>
                    {event.score > 28 && <Badge className="bg-primary hover:bg-primary/80">Hot<Flame /></Badge>}
                    {/* <Badge variant={status === "ongoing" ? "default" : status === "ended" ? "secondary" : "outline"}>
                        {status === "ongoing" ? "Happening now" : status === "ended" ? "Ended" : "Upcoming"}
                    </Badge> */}
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                <div className="flex items-start gap-2 mb-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mt-0.5" />
                    <div className="space-y-1">
                        <div>Starts: {formatDate(event.start_time)} at {formatTime(event.start_time)}</div>
                        <div>Ends: {formatDate(event.end_time)} at {formatTime(event.end_time)}</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-accent" />
                    <span>{event.attendees_count || 0} attending</span>
                </div>
            </CardFooter>
        </Card>
    )
}

