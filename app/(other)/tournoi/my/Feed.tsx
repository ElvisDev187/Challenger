"use client"
import { ExtendedTournoi } from '@/types/db'
import React from 'react'
import TournoiCard from '@/components/Tournoi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
interface FeedProps {
    Mytournois: ExtendedTournoi[],
    MyResponsabilities: ExtendedTournoi[]
}
export default function Feed({ MyResponsabilities, Mytournois }: FeedProps) {
    return (
        <Tabs defaultValue="create" className="w-full">
            <TabsList>
                <TabsTrigger value="create">Vos Tournois</TabsTrigger>
                <TabsTrigger value="participate">Vos Participations</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
                <div className='mt-5 grid grid-cols-3 p-7 w-full gap-5'>

                    {Mytournois?.length && Mytournois.map((tournoi) => (
                        <TournoiCard {...tournoi} key={tournoi.id} />
                    ))}

                </div>
            </TabsContent>
            <TabsContent value="participate">
                <div className='mt-5 grid grid-cols-3 p-7 w-full gap-5'>
                    {MyResponsabilities?.length && MyResponsabilities.map((tournoi) => (

                        <TournoiCard {...tournoi} key={tournoi.id} />

                    ))}
                </div>
            </TabsContent>
        </Tabs>
    )
}
