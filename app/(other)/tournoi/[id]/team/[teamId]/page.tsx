
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'
import { BiFootball } from 'react-icons/bi'
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
            matchIns: {
                include: {
                    equipeIn: true,
                    equipeOut: true,
                    infoMatchs: true
                }
            },
            matchOuts: {
                include: {
                    equipeIn: true,
                    equipeOut: true,
                    infoMatchs: true
                }
            },
        }
    })
    if (!team) return notFound()
    const players = team.players.map((player) => {
        return player
    })
    const matchInsPass = team.matchIns.filter((match) => match.status === "TERMINE")
    const matchOutsPass = team.matchOuts.filter((match) => match.status === "TERMINE")
    const Passed = [...matchInsPass, ...matchOutsPass]

    const matchInsPen = team.matchIns.filter((match) => match.status === "ATTENTE" || match.status === "REPORTE")
    const matchOutsPen = team.matchOuts.filter((match) => match.status === "ATTENTE" || match.status === "REPORTE")
    const Pending = [...matchInsPen, ...matchOutsPen]
    return (
        <>

            <h1 className='font-bold text-2xl md:text-4xl h-14'>
                Information de l'equipe: {team.name}
            </h1>

            {/* liste des joueur dans des petite card */}
            <h1 className='font-medium text-lg md:text-xl h-14'>
                Statistiques des joueurs
            </h1>
            <div className='grid grid-cols-3 gap-4'>

            
            {
                players.map((player) => {

                    const yelloAMt = player.infoMatchs.reduce((acc, info) => {
                        if (info.type === "CARTON_JAUNE") acc + 1
                        return acc
                    }, 0)

                    const redAMt = player.infoMatchs.reduce((acc, info) => {
                        if (info.type === "CARTON_ROUGE") acc + 1
                        return acc
                    }, 0)
                    const goalAMt = player.infoMatchs.reduce((acc, info) => {
                        if (info.type === "BUT") acc + 1
                        return acc
                    }, 0)

                    return (
                        <div className='bg-white rounded-sm shadow-md p-4 w-[250px]' key={player.id}>
                            <ul className=''>
                                <li className="text-sm py-2 font-medium">{player.name}</li>
                                <li className="text-sm py-2 font-medium">{player.poste}</li>
                                <li className="text-sm py-2 font-medium">{player.age} ans</li>
                            </ul>
                            <div className='flex p-1 gap-2'>
                                <div className=' flex gap-1'>
                                  <span className='h-6 w-4 bg-red-500'/>
                                  {redAMt}
                                </div> 
                                <div className=' flex gap-1'>
                                  <span className='h-6 w-4 bg-yellow-300'/>
                                  {yelloAMt}
                                </div> 
                                <div className=' flex gap-1'>
                                 <BiFootball className='h-6 w-6'/>
                                  {goalAMt}
                                </div> 
                            </div>

                        </div>
                    )
                })
            }
            </div>

            {/* liste des prochains matchs*/}
            <h1 className='font-medium text-lg md:text-xl h-14'>
                Liste des prochains matchs
            </h1>
            <div>
                {Pending.length > 0 ?
                    Pending.map((match) => (
                        <div className='flex items-center justify-center p-3 gap-2' key={match.id}>
                            {match.equipeIn.name} vs {match.equipeOut.name}
                        </div>
                    ))
                    :
                    <p>Aucun match prevu</p>
                }
            </div>
            {/* liste des matchs deja joues */}
            <h1 className='font-medium text-lg md:text-xl h-14'>
                Statistiques des matchs
            </h1>
            <div>
                {Passed.length > 0 ?
                    Passed.map((match) => (
                        <div className='flex items-center justify-center p-3 gap-2'key={match.id}>
                            {match.equipeIn.name} vs {match.equipeOut.name}
                        </div>
                    ))
                    :
                    <p>Aucun match joue</p>
                }
            </div>
        </>
    )
}
