"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { updateAttendance } from "@/lib/actions"
import { Check, Loader2 } from "lucide-react"

interface AttendButtonProps {
    eventId: string
    attendees_count: number
    isAttending: boolean
    userId?: string
}

export function AttendButton({ eventId, attendees_count, isAttending, userId }: AttendButtonProps) {
    const [isPending, setIsPending] = useState(false)
    const [attending, setAttending] = useState(isAttending)
    const router = useRouter()

    const handleAttendance = async () => {
        if (!userId) {
            // Redirect to login with the current URL as the redirect target
            const currentPath = window.location.pathname
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
            return
        }

        setIsPending(true)
        try {
            updateAttendance(eventId, attendees_count, !attending).then((result) => {
                setAttending(!attending)
            })
        } catch (error) {
            console.error("Error updating attendance:", error)
        } finally {
            setIsPending(false)
            router.refresh()
        }
    }

    return (
        <Button
            onClick={handleAttendance}
            disabled={isPending}
            variant={attending ? "outline" : "default"}
            className={attending ? "border-primary text-primary hover:bg-primary/10" : ""}
            size="lg"
        >
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : attending ? (
                <Check className="mr-2 h-4 w-4" />
            ) : null}
            {attending ? "I'm Going!" : "I'm Going"}
        </Button>
    )
}

