"use client"
import FormGroup from '@/components/FormGroup'
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
                                    <div className='bg-white p-3 rounded-sm flex flex-col gap-2 shadow-md text-sm font-medium text-slate-900 ' key={arbitre.id}>
                                        <p> {arbitre.name}</p>
                                        <p> {arbitre.email}</p>
                                    </div>
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
                                    <div className='bg-white p-3 rounded-sm flex flex-col gap-2 text-sm shadow-md font-medium text-slate-900 ' key={assistant.id}>
                                        <p>{assistant.name}</p>
                                        <p>  {assistant.email}</p>
                                    </div>
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
                        <FormGroup />
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
