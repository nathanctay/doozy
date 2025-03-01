import Link from 'next/link'
import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('score', { ascending: false })
    .gte('end_time', new Date().toISOString())
    .limit(6)

  if (error) {
    console.error('Error fetching events:', error)
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="py-12 md:py-20 animated-gradient">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Discover Events Near You
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Find Your Next <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Adventure</span>
            </h1>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              In <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">Logan, Utah</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Join exciting events, meet new people, and create unforgettable memories in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/events">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Events
                </Link>
              </Button>
              {/* <Button size="lg" variant="outline" asChild>
                <Link href="/events/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button variant="ghost" asChild>
              <Link href="/events">View all</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events && events.length > 0 ? (
              events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="block">
                  <EventCard event={event} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">There are no upcoming events in your area.</p>
                {/* <Button asChild>
                  <Link href="/events/new">Create an Event</Link>
                </Button> */}
              </div>
            )}
          </div>
        </div>
      </section>


    </main>
  )
}
