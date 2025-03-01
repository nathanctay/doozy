import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { formatDate } from "@/lib/utils"

interface EventCardProps {
    event: {
        id: string
        title: string
        date: string
        location: string
        event_type: string
        attendees_count: number
    }
}

export function EventCard({ event }: EventCardProps) {
    return (
        <Card className="h-full hover:shadow-md transition-shadow overflow-hidden border-primary/20">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
            <CardContent className="pt-6">
                <Badge className="mb-2 bg-secondary hover:bg-secondary/80">{event.event_type}</Badge>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                    <span>{formatDate(event.date)}</span>
                </div>
                {/* <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span className="line-clamp-1">{event.location}</span>
                </div> */}
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
