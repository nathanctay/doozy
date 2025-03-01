import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage() {
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        redirect("/")
    }

    return <ForgotPasswordForm />
}

