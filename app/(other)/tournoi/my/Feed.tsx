"use client"
import { ExtendedTournoi } from '@/types/db'
import React from 'react'
import TournoiCard from '@/components/Tournoi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
interface FeedProps {
    Mytournois: ExtendedTournoi[],
    MyResponsabilities: ExtendedTournoi[],
    MysTaff: ExtendedTournoi[]
}
export default function Feed({ MyResponsabilities, Mytournois, MysTaff }: FeedProps) {
    return (
        <Tabs defaultValue="create" className="w-full">
            <TabsList>
                <TabsTrigger value="create">Vos Tournois</TabsTrigger>
                <TabsTrigger value="participate">Vos Participations</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
                <div className='mt-5 grid grid-cols-3 p-7 w-full gap-5'>

                    {Mytournois?.length && Mytournois.map((tournoi) => (
                        <TournoiCard staff={false} tournoi={tournoi} key={tournoi.id} />
                    ))}

                    {Mytournois.length == 0 && (
                        <h1 className='font-bold text-3xl md:text-4xl h-14'>
                            Rien pour le moment
                        </h1>
                    )}

                </div>
            </TabsContent>
            <TabsContent value="participate">
                <div className='mt-5 grid grid-cols-3 p-7 w-full gap-5'>
                    {MyResponsabilities?.length && MyResponsabilities.map((tournoi) => (

                        <TournoiCard staff={false} tournoi={tournoi} key={tournoi.id} />

                    ))}
                     {MyResponsabilities.length == 0 && (
                        <h1 className='font-bold text-3xl md:text-4xl h-14'>
                            Rien pour le moment
                        </h1>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="staff">
                <div className='mt-5 grid grid-cols-3 p-7 w-full gap-5'>
                    {MysTaff?.length && MysTaff.map((tournoi) => (

                        <TournoiCard staff={true} tournoi={tournoi} key={tournoi.id} />

                    ))}
                     {MysTaff.length == 0 && (
                        <h1 className='font-bold text-3xl md:text-4xl h-14'>
                            Rien pour le moment
                        </h1>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}
