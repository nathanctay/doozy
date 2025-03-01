"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { login } from "@/lib/auth-actions"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

interface LoginFormProps {
    redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [error, setError] = React.useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const result = await login(values)

                if (result.error) {
                    setError(result.error)
                    toast("Error", {
                        description: result.error,
                    })
                    return
                }

                if (result.success) {
                    router.refresh()
                    router.push((redirectTo !== '/register' && redirectTo !== '/login' ? redirectTo : "/") || "/")
                    return
                }

                router.refresh()
                router.push("/")

            } catch (error) {
                setError("Something went wrong. Please try again.")
                toast("Error", {
                    description: "Something went wrong. Please try again.",
                })
            }
        })
    }

    return (
        <div className="grid gap-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Enter your email to sign in to your account</p>
            </div>
            {error && <div className="text-center text-sm text-red-500">{error}</div>}

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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="••••••••" type="password" disabled={isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isPending} className="w-full">
                {isPending ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                    Sign up
                </Link>
            </div>
            <div className="text-center text-sm">
                <Link href="/forgot-password" className="text-primary hover:underline">
                    Forgot your password?
                </Link>
            </div>
        </div>
    )
}

