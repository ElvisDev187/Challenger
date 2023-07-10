"use client"
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExtendedTournoi } from '@/types/db'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Props {
    tournoi: ExtendedTournoi
}
export default function Admin({ tournoi }: Props) {
    return (
        <Tabs defaultValue="staff" className="w-full">
            <TabsList>
                <TabsTrigger value="staff">Staffs</TabsTrigger>
                <TabsTrigger value="matchs">Matchs</TabsTrigger>
                <TabsTrigger value="stat">Statisquiques</TabsTrigger>
            </TabsList>
            <TabsContent value="staff">
                <>
                    <h1 className='font-medium text-lg md:text-xl h-10'>
                        Arbitres ({tournoi.arbitres?.length})
                    </h1>
                    <Link href={``} className={buttonVariants({
                        variant: "default",
                        class: "bg-emerald-400 flex items-center justify-center my-5"
                    })}>
                        <PlusCircle className='h-6 w-6' />
                        Ajouter
                    </Link>
                    <h1 className='font-medium text-lg md:text-xl h-10'>
                        Assistants ({tournoi.assistants?.length})
                    </h1>
                    <Link href={``} className={buttonVariants({
                        variant: "default",
                        class: "bg-emerald-400 flex items-center justify-center my-5"
                    })}>
                        <PlusCircle className='h-6 w-6' />
                        Ajouter
                    </Link>

                </>
            </TabsContent>
            <TabsContent value="matchs">
                <div className=''>

                </div>
            </TabsContent>
            <TabsContent value="stat">
                <div className=''>

                </div>
            </TabsContent>
        </Tabs>
    )
}
