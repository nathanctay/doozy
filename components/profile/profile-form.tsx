"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { updateProfile } from "@/lib/actions"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z
        .string()
        .max(500, {
            message: "Bio must not be longer than 500 characters.",
        })
        .optional(),
    website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    user: any
    profile: any
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: profile?.name || user?.user_metadata?.name || "",
        },
    })

    function onSubmit(data: ProfileFormValues) {
        startTransition(async () => {
            try {
                const result = await updateProfile({
                    ...data,
                    id: user.id,
                })

                if (result.error) {
                    toast("Error", {
                        description: result.error,
                    })
                    return
                }

                toast("Success", {
                    description: "Your profile has been updated.",
                })
            } catch (error) {
                toast("Error", {
                    description: "Something went wrong. Please try again.",
                })
            }
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="text-lg">
                                {(profile?.name || user?.email || "").charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{profile?.name || user?.user_metadata?.name}</h2>
                            <p className="text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button type="submit" disabled={isPending}>
                                {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                Update profile
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

