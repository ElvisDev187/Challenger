
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'
interface PageProps {
    params: {
        id: string,
        teamId: string
    }
}
export default async function page({ params }: PageProps) {
    const session = await getAuthSession()
    const { id, teamId } = params
    const team = await db.team.findFirst({
        where: {
            id: teamId,
            tournoiId: id,
            responsableId: session?.user.id
        },
        include: {
            players: {
                include: {
                    infoMatchs: true
                }
            },
            matchIns: true,
            matchOuts: true,
        }
    })
    if(!team) return notFound()
    return (
        <>

            <h1 className='font-bold text-2xl md:text-4xl h-14'>
                Information de l'equipe: {team.name}
            </h1>

            {/* liste des joueur dans des petite card */}
            <h1 className='font-medium text-lg md:text-xl h-14'>
                Statistiques des joueurs
            </h1>
            {/* liste des prochains matchs*/}
            <h1 className='font-medium text-lg md:text-xl h-14'>
                Liste des prochains matchs
            </h1>
            {/* liste des matchs deja joues */}
            <h1 className='font-medium text-lg md:text-xl h-14'>
                Statistiques des matchs
            </h1>
        </>
    )
}
