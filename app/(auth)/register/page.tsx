import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"
import { createClient } from "@/utils/supabase/server"

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: { redirect?: string }
}) {
    const supabase = await createClient()
    const redirectTo = (await searchParams).redirect

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        redirect(redirectTo || "/")
    }

    return <RegisterForm redirectTo={redirectTo} />
}

