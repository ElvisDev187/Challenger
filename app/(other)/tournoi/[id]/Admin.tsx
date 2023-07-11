"use client"
import FormGroup from '@/components/FormGroup'
import StaffCard from '@/components/StaffCard'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExtendedTournoi } from '@/types/db'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

interface Props {
    tournoi: ExtendedTournoi
}
export default function Admin({ tournoi }: Props) {
    const [isFormGroupOpen, setIsformGroupOpen] = useState(false)

    const nbMatch = tournoi.tours?.reduce((acc, tour) => {
        if (tour.matchs?.length) acc + tour.matchs.length
        return acc
    }, 0)
    const teamWithOutGroup = tournoi.teams?.filter((team) => team.pouleId != null)
        .map((team) => {
            return { id: team.id, label: team.name }
        })

    return (
        <Tabs defaultValue="staff" className="w-full">
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
                                   <StaffCard tournoiId={arbitre.tournoiId} key={arbitre.id} name={arbitre.name} email={arbitre.email} id={arbitre.id} role='ARBITRE'/>
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
                                    <StaffCard tournoiId={assistant.tournoiId} key={assistant.id} name={assistant.name} email={assistant.email} id={assistant.id} role='ASSISTANT'/>

                                )
                            })
                        }
                    </div>

                    <Link href={`/tournoi/${tournoi.id}/staff`} className={buttonVariants({
                        variant: "default",
                        class: "bg-emerald-400  flex items-center justify-center my-5 gap-1"
                    })}>
                        <PlusCircle className='h-6 w-6' />
                        Ajouter
                    </Link>


                </>
            </TabsContent>
            <TabsContent value="matchs">
                <>
                    <h1 className='font-medium text-lg md:text-xl h-10'>
                        Matchs ({nbMatch})
                    </h1>
                </>
            </TabsContent>
            <TabsContent value="stat">
                <>
                    {isFormGroupOpen ?
                        <FormGroup teams={teamWithOutGroup!} tournoiId={tournoi.id} />
                        :
                        <>
                            <h1 className='font-medium text-lg md:text-xl h-10'>
                                Equipes ({tournoi?.teams?.length || 0})
                            </h1>
                            <Button className='flex items-center justify-center my-5 gap-1' onClick={() => setIsformGroupOpen(true)}>
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
