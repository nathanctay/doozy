import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"
import { createClient } from "@/utils/supabase/server"

export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/auth/login?redirect=/profile")
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    return (
        <main className="container max-w-3xl py-6 px-4 md:px-6 lg:py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and profile information</p>
                </div>
                <ProfileForm user={session.user} profile={profile} />
            </div>
        </main>
    )
}

