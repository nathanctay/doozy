import { LoginForm } from "@/components/auth/login-form"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { redirect?: string }
}) {
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        redirect(searchParams.redirect || "/")
    }

    return <LoginForm redirectTo={searchParams.redirect} />
}

