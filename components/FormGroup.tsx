"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { useCustomToasts } from "@/hooks/use-custom-toasts"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { DisplayFormValues, GroupPayload, displayFormSchema } from "@/lib/validators/group"
import { useFormGroup } from "@/context/store"

type item = {
    id: string
    label: string
}
interface Props {
    teams: item[] | undefined,
    tournoiId: string
}




export default function FormGroup({ teams, tournoiId }: Props) {
    const items = [...teams!] as const
   const {isOpen, toggle} = useFormGroup()

    const { toast } = useToast()
    const form = useForm<DisplayFormValues>({
        resolver: zodResolver(displayFormSchema),
        defaultValues: {
            items: []
        }
    })
    const { loginToast } = useCustomToasts()
    const { mutate: CreateGroup, isLoading } = useMutation({
        mutationFn: async (items: string[]) => {
            const payload: GroupPayload = {
                items,
                tournoiId
            }

            const { data } = await axios.post('/api/tournoi/group', payload)
            return data as string
        },
        onError: (err: any) => {
            if (err instanceof AxiosError) {

                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            toast({
                title: 'There was an error.',
                description: 'Could not delete.',
                variant: 'destructive',
            })
        },
        onSuccess: (data: any) => {

            toast({
                description: `Le Group ${data} a ete creer avec succes`,
            })

        },
    })

    function onSubmit(data: DisplayFormValues) {
        CreateGroup(data.items)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        form.reset()
        toggle(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Equipes disponibles</FormLabel>
                                <FormDescription>
                                    Selectionner un nombre paire d'equipe pour former un groupe
                                </FormDescription>
                            </div>
                            {items?.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="items"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null} Former
                    </Button>
                    <Button variant="outline" disabled={isLoading}>Annuler</Button>
                </div>
            </form>
        </Form>
    )
}
