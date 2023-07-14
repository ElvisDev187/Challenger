"use client"
import FormGroup from '@/components/FormGroup'
import GroupCard from '@/components/GroupCard'
import MatchForm from '@/components/MatchForm'
import StaffCard from '@/components/StaffCard'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { useFormGroup, useFormMatch } from '@/context/store'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { cn } from '@/lib/utils'
import { AutoAction } from '@/lib/validators/auto'
import { ExtendedMatch, ExtendedTournoi } from '@/types/db'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { startTransition, useState } from 'react'

interface Props {
    tournoi: ExtendedTournoi
}
export default function Admin({ tournoi }: Props) {
    const { isOpen, toggle } = useFormGroup()
    const { isFormMatchOpen, toggleForMatch } = useFormMatch()
    const router = useRouter()
    const [Selmatch,setMatch] = useState<ExtendedMatch>()

    const nbMatch = tournoi.tours?.reduce((acc, tour) => {
        if (tour.matchs?.length) acc + tour.matchs.length
        return acc
    }, 0)
    const teamWithOutGroup = tournoi.teams?.filter((team) => team.pouleId === null)
        .map((team) => {
            return { id: team.id, label: team.name }
        })

    const nbPlan = tournoi.tours[0]?.matchs?.filter((match)=> match.arbitre == null).length


    const { loginToast } = useCustomToasts()

    const { mutate: MatchAuto, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: AutoAction = {
                tournoiId: tournoi.id
            }
            toast({
                title: "Background Actions",
                description: "Patienter quelques instant nous generons les matchs possibles"
            })
            const res = await axios.post('/api/auto/matchs/simple', payload)
            return res.data as string
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
                description: 'Could not create subreddit same.',
                variant: 'destructive',
            })
            console.log(err)
        },
        onSuccess: (data: any) => {

            toast({
                title: "Background Actions",
                description: "Completed!"
            })
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
        },
    })

    return (
        <Tabs defaultValue="staff" className="w-full relative">
            <TabsList>
                <TabsTrigger value="staff">Staffs</TabsTrigger>
                <TabsTrigger value="matchs">Matchs</TabsTrigger>
                <TabsTrigger value="stat">Equipues</TabsTrigger>
            </TabsList>
            <TabsContent value="staff">
                <>
                    <h1 className='font-medium text-lg md:text-xl h-10'>
                        Arbitres ({tournoi.arbitres?.length})
                    </h1>

                    <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5'>
                        {
                            tournoi.arbitres?.map((arbitre) => {
                                return (
                                    <StaffCard tournoiId={arbitre.tournoiId} key={arbitre.id} name={arbitre.name} email={arbitre.email} id={arbitre.id} role='ARBITRE' />
                                )
                            })
                        }
                    </div>

                    <h1 className='font-medium text-lg md:text-xl h-10'>
                        Assistants ({tournoi.assistants?.length})
                    </h1>
                    <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
                        {
                            tournoi.assistants?.map((assistant) => {
                                return (
                                    <StaffCard tournoiId={assistant.tournoiId} key={assistant.id} name={assistant.name} email={assistant.email} id={assistant.id} role='ASSISTANT' />

                                )
                            })
                        }
                    </div>

                    <Link href={`/tournoi/${tournoi.id}/staff`} className={buttonVariants({
                        variant: "default",
                        class: "bg-emerald-400  flex items-center justify-center my-5 gap-1 absolute top-0 right-20"
                    })}>
                        <PlusCircle className='h-6 w-6' />
                        Ajouter
                    </Link>


                </>
            </TabsContent>
            <TabsContent value="matchs">
                <>
                    {isFormMatchOpen ?
                        <>
                            {tournoi.tours?.length <= 1 ?
                                <MatchForm match={Selmatch} tournoi={tournoi} />

                                :
                                <>more complicated action</>
                            }
                        </>
                        :
                        <>
                            <h1 className='font-medium text-lg md:text-xl h-10'>
                                Matchs ({ tournoi.Setting?.mode == "GROUP"? nbMatch : nbPlan})
                            </h1>


                            <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
                                {
                                    tournoi.Setting?.mode == "SIMPLE" ?
                                        <>
                                            {
                                                tournoi.tours[0]?.matchs?.filter((match)=> match.arbitre == null).map((match) => {
                                                    return (
                                                        <label htmlFor={match.id}>
                                                        <div className='bg-white p-3 relative rounded-sm flex flex-col gap-2 items-center justify-center shadow-md text-sm font-medium text-slate-900 ' key={match.id}>
                                                            <div className='flex gap-2'>
                                                                <p> {match.equipeIn.name}</p> <p className='text-md'>vs</p> <p>{match.equipeOut.name}</p>
                                                            </div>
                                                            <Checkbox 
                                                            className='absolute top-1 right-2'
                                                            onCheckedChange={(e)=>{
                                                               return e? setMatch(match) :setMatch(undefined)
                                                            }}
                                                            checked={Selmatch?.id == match.id} 
                                                            id={match.id} name='selected' />
                                                        </div>
                                                        </label>

                                                    )
                                                })
                                            }


                                        </>
                                        :
                                        <>
                                        </>
                                }
                            </div>
                            <h1 className='font-medium text-lg md:text-xl h-10'>
                                Matchs futur ({ tournoi.Setting?.mode == "GROUP"? 0 :  tournoi.tours[0]?.matchs?.filter((match)=> match.arbitre != null && match.status == "ATTENTE").length})
                            </h1>
                            <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
                                {
                                    tournoi.Setting?.mode == "SIMPLE" ?
                                        <>
                                            {
                                                tournoi.tours[0]?.matchs?.filter((match)=> match.arbitre !== null && match.status == "ATTENTE").map((match) => {
                                                    return (
                                                        
                                                        <div className='bg-white p-3 relative rounded-sm flex flex-col gap-2 items-center justify-center shadow-md text-sm font-medium text-slate-900 ' key={match.id}>
                                                            <div className='flex gap-2'>
                                                                <p> {match.equipeIn.name}</p> <p className='text-md'>vs</p> <p>{match.equipeOut.name}</p>
                                                            </div>
                                                            <p className='flex gaap-1'>{match.date} - {match.heure} - {match.terrain}</p>                                                
                                                        </div>
                                                       
                                                    )
                                                })
                                            }


                                        </>
                                        :
                                        <>
                                        </>
                                }
                            </div>


                            <Button disabled={isLoading} className='flex items-center justify-center my-5 gap-1 absolute top-0 right-20' onClick={async () => {
                                if (tournoi.Setting?.mode == "SIMPLE" && tournoi.tours.length == 0 && tournoi.groups.length == 0) {
                                    MatchAuto()
                                    return;
                                }
                               
                            }}>
                                {isLoading ? <Loader2 className='h-6 w-6 animate-spin' /> : <PlusCircle className='h-6 w-6' />}
                                Generer les matchs
                            </Button>
                            <Button disabled={isLoading} className={` ${Selmatch? "flex": "hidden"} items-center justify-center my-5 gap-1 absolute top-0 right-[270px]`} onClick={async () => {
                                toggleForMatch(true)
                               
                            }}>
                                {isLoading ? <Loader2 className='h-6 w-6 animate-spin' /> : <PlusCircle className='h-6 w-6' />}
                                Planifier
                            </Button>
                        </>
                    }


                </>
            </TabsContent>
            <TabsContent value="stat">
                <>
                    {isOpen ?
                        <FormGroup teams={teamWithOutGroup!} tournoiId={tournoi.id} />
                        :
                        <>
                            <h1 className='font-medium text-lg md:text-xl h-10'>
                                Equipes ({tournoi?.teams?.length || 0})
                            </h1>

                            <div className='mt-1 grid grid-cols-3 p-7 w-full gap-5' >
                                {
                                    tournoi.teams?.map((team) => {
                                        return (
                                            <div className='bg-white p-3 rounded-sm flex flex-col shadow-md text-sm font-medium text-slate-900 ' key={team.id}>
                                                <p> {team.name}</p>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                            <h1 className='font-medium text-lg md:text-xl h-10'>
                                Groupes ({tournoi?.groups?.length})
                            </h1>
                            <div className='mt-1 grid grid-cols-3 p-7 w-full gap-3' >
                                {tournoi?.groups?.length > 0 && tournoi.groups?.map((group) => (<GroupCard group={group} key={group.id} />))}
                            </div>
                            <Button className='flex items-center justify-center my-5 gap-1' onClick={() => toggle(true)}>
                                <PlusCircle className='h-6 w-6' />
                                Former un groupe
                            </Button>
                        </>
                    }
                </>
            </TabsContent>
        </Tabs>
    )
}
