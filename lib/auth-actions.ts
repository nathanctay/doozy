"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { z } from "zod"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(formData: z.infer<typeof loginSchema>) {
    const supabase = await createClient()

    const result = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    })

    if (result.error) {
        return { error: result.error.message }
    }

    return { success: true }
}

export async function register(formData: z.infer<typeof registerSchema>) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                name: formData.name,
            },
        },
    })

    console.log("AuthResult", data)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
}

export async function resetPasswordRequest(email: string) {
    const supabase = await createClient()

    const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (result.error) {
        return { error: result.error.message }
    }

    return { success: true }
}

export async function resetPassword({
    password,
    token,
}: {
    password: string
    token: string
}) {
    const supabase = await createClient()

    if (!token) {
        return { error: "Invalid or expired reset token" }
    }

    const result = await supabase.auth.updateUser({
        password,
    })

    if (result.error) {
        return { error: result.error.message }
    }

    return { success: true }
}

