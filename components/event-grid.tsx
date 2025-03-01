"use client"

import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface EventGridProps {
    events: any[]
    totalEvents: number
    currentPage: number
    pageSize: number
    searchParams: { [key: string]: string | undefined }
}

export function EventGrid({ events, totalEvents, currentPage, pageSize, searchParams }: EventGridProps) {
    const router = useRouter()
    const params = useSearchParams()
    const pathname = usePathname()
    console.log(usePathname())

    const totalPages = Math.ceil(totalEvents / pageSize)

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(params.toString())
        newParams.set("page", page.toString())
        router.push(`${pathname}?${newParams.toString()}`)
    }

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push(-1) // Ellipsis
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push(-1) // Ellipsis
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push(-1) // Ellipsis
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push(-1) // Ellipsis
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="space-y-6">
            {events.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Link href={`events/${event.id}`} key={event.id}>
                                <EventCard event={event} />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalEvents)} of{" "}
                            {totalEvents} events
                        </p>

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage > 1) handlePageChange(currentPage - 1)
                                        }}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((pageNum, i) =>
                                    pageNum === -1 ? (
                                        <PaginationItem key={`ellipsis-${i}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handlePageChange(pageNum)
                                                }}
                                                isActive={pageNum === currentPage}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ),
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage < totalPages) handlePageChange(currentPage + 1)
                                        }}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No events found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                    <Button onClick={() => router.push(`${pathname}`)}>Clear filters</Button>
                </div>
            )}
        </div>
    )
}

