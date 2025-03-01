"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { resetPasswordRequest } from "@/lib/auth-actions"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

export function ForgotPasswordForm() {
    const [isPending, startTransition] = React.useTransition()
    const [isSuccess, setIsSuccess] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const result = await resetPasswordRequest(values.email)

                if (result.error) {
                    toast("Error", {
                        description: result.error,
                    })
                    return
                }

                setIsSuccess(true)
            } catch (error) {
                toast("Error", {
                    description: "Something went wrong. Please try again.",
                })
            }
        })
    }

    if (isSuccess) {
        return (
            <div className="space-y-4 text-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Check your email</h1>
                    <p className="text-muted-foreground">We&apos;ve sent you a password reset link. Please check your email.</p>
                </div>
                <Button asChild className="w-full">
                    <Link href="/login">Back to login</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-muted-foreground">Enter your email and we&apos;ll send you a reset link</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="m@example.com" type="email" disabled={isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Send reset link
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    )
}

