import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EventsLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-full">
                    <CardContent className="pt-6">
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <Skeleton className="h-4 w-24" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

