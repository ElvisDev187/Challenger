'use client'
import "@uploadthing/react/styles.css";
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { ExtendedTournoi, ExtendedMatch } from "@/types/db";
import { useFormMatch } from "@/context/store";
import { UpdateMatchPayload } from "@/lib/validators/match";


interface Props {
    tournoi: ExtendedTournoi,
    match: ExtendedMatch | undefined
}

const MatchForm = ({tournoi, match}:Props) => {
    const router = useRouter()
    const [terrain, setTerrain] = useState<string>('')
    const [time, setTime] = useState('')
    const [arbitreId, setAb] = useState('')
    const [assId, setAss] = useState<string>('')
    const [debut, setDateDeb] = useState<Date>()

    const { loginToast } = useCustomToasts()
    const { isFormMatchOpen, toggleForMatch } = useFormMatch()

    const { mutate: createTournoi, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: UpdateMatchPayload = {
                matchId: match?.id!,
                terrain,
                time,
                date: debut?.toDateString()!,
                assistantId: assId,
                arbitreId: arbitreId
            }

            const { data } = await axios.post('/api/tournoi/match', payload)
            return data as string
        },
        onError: (err: any) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Subreddit already exists.',
                        description: 'Please choose a different name.',
                        variant: 'destructive',
                    })
                }

                if (err.response?.status === 422) {
                    return toast({
                        title: 'Invalid subreddit name.',
                        description: 'Please choose a name between 3 and 21 letters.',
                        variant: 'destructive',
                    })
                }

                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            toast({
                title: 'There was an error.',
                description: 'Could not create subreddit.',
                variant: 'destructive',
            })
        },
        onSuccess: (data: any) => {

            toast({
                description: 'Nouveou tournoi creer avec success',
            })
            startTransition(()=>{
                router.refresh()
            })
            toggleForMatch(false)

            
        },
    })

    return (
        <>
            <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-10">
                <h1 className="text-xl text-center font-bold py-5 text-slate-900 capitalize dark:text-white">{match?.equipeIn.name} vs {match?.equipeOut.name}</h1>
                <hr className='bg-gray-500 h-px' />
                <form>
                    <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="username">Terrain</label>
                            <Input value={terrain} onChange={(e) => setTerrain(e.target.value)} id="username" type="text" className='placeholder:text-slate-900 font-semibold' />
                        </div>
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="passwordConfirmation">Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-[40px] justify-start text-left font-normal",
                                            !debut && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {debut ? <span className="font-semibold text-slate-900">{format(debut, "PPP")}</span> : <span>Selectioner une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={debut}
                                        onSelect={setDateDeb}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="emailAddress">Heure</label>
                            <Input value={time} onChange={(e) => setTime(e.target.value)} id="username" type="time" className='placeholder:text-slate-900 font-semibold' />
                        </div>
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="emailAddress">Arbitre</label>
                            <Select onValueChange={(value)=>{
                                setAb(value)
                                alert(value)
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selectionnez un arbitre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Arbitres</SelectLabel>
                                        {tournoi.arbitres.map((assistant)=>(
                                          <SelectItem value={assistant.id} key={assistant.id}>{assistant.name}</SelectItem>
                                      ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="emailAddress">Assistant</label>
                            <Select onValueChange={(value)=>{
                                setAss(value)                              
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selectionnez un assistant" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Assistants</SelectLabel>
                                      {tournoi.assistants.map((assistant)=>(
                                          <SelectItem value={assistant.id} key={assistant.id}>{assistant.name}</SelectItem>
                                      ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>                
                        </div>

                    </div>

                    <div className="flex justify-end mt-6 gap-4">
                        <Button
                            disabled={isLoading}
                            variant='outline'
                            onClick={() => toggleForMatch(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={(e) => {
                            e.preventDefault()
                            createTournoi()
                        }} className="px-6 py-2 leading-5 ">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Save</Button>
                    </div>
                </form>
            </section>

        </>
    )
}

export default MatchForm
