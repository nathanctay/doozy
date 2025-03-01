"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function updateAttendance(eventId: string, attendees_count: number, attending: boolean) {
    const supabase = await createClient()

    // Get current user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("You must be logged in to attend events")
    }

    if (attending) {
        console.log("Adding attendance")
        // Add user to attendees
        const { error } = await supabase.from("event_attendees").insert({
            event_id: eventId,
            user_id: user.id,
        })

        if (error) {
            console.error("Error adding attendance:", error)
            throw new Error("Failed to update attendance")
        }
        else {
            const { data: attendees } = await supabase.from('event_attendees').select('*').eq('event_id', eventId)
            console.log(attendees?.length)
            const { error } = await supabase.from('events').update({ attendees_count: attendees?.length || attendees_count + 1 }).eq('id', eventId)
        }
    } else {
        // Remove user from attendees
        const { error } = await supabase.from("event_attendees").delete().eq("event_id", eventId).eq("user_id", user.id)

        if (error) {
            console.error("Error removing attendance:", error)
            throw new Error("Failed to update attendance")
        }
        else {
            const { data: attendees } = await supabase.from('event_attendees').select('*').eq('event_id', eventId)
            const { error } = await supabase.from('events').update({ attendees_count: attendees?.length || attendees_count - 1 }).eq('id', eventId)
        }
    }

    // Revalidate the event page to show updated attendees
    revalidatePath(`/events/${eventId}`)
    revalidatePath("/")
}

