import ViewTeam from '@/components/ViewTeam'
import { buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import {format} from 'date-fns'
import {  Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { ReactNode } from 'react'
export const metadata: Metadata = {
    title: 'Challengers',
    description: 'A Reddit clone built with Next.js and TypeScript.',
}
interface pageProps {
    children: ReactNode,
    params: { id: string },
 
}
export default async function layout({ children, params: { id } }: pageProps) {
    const session = await getAuthSession()
    const tournoi = await db.tournoi.findUnique({
        where: {
            id: id
        },
        include: {
            teams: {
                include: {
                    _count: true
                }
            },

        }
    })

    const inscription = await db.team.findFirst({
        where: {
            tournoiId: id,
            responsableId: session?.user.id || ""
        }
    })
 
    
    const isSubscribed = !!inscription
    if (!tournoi) return notFound()

    

    
    return (
        <div className='sm:container max-w-7xl mx-auto h-full pt-12'>
            <div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
                    <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>
                    {/* info sidebar */}
                    <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
                        <div className='px-6 py-4'>
                            <p className='font-semibold py-3'>A Propos de {tournoi.name}</p>
                        </div>
                        <dl className='divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white'>
                            <div className='flex justify-between gap-x-4 py-3'>
                                <dt className='text-gray-500'>Cloture d'inscription</dt>
                                <dd className='text-gray-700'>
                                    <div className='text-gray-900 font-medium'>{ format(new Date(tournoi.inscriptionLimit.split("/").reverse().join("-")),"dd MMMM yyy")}</div>
                                </dd>
                            </div>
                            <div className='flex justify-between gap-x-4 py-3'>
                                <dt className='text-gray-500'>Ouverture</dt>
                                <dd className='text-gray-700'>
                                    <div className='text-gray-900 font-medium'>{ format(new Date(tournoi.debut.split("/").reverse().join("-")),"dd MMMM yyy")}</div>
                                </dd>
                            </div>
                            <div className='flex justify-between gap-x-4 py-3'>
                                <dt className='text-gray-500'>Limite d'age</dt>
                                <dd className='flex items-start gap-x-2'>
                                    <div className='text-gray-900 font-medium'>{tournoi.ageMax} ans</div>
                                </dd>
                            </div>
                            <div className='flex justify-between gap-x-4 py-3'>
                                <dt className='text-gray-500'>Inscrits</dt>
                                <dd className='flex items-start gap-x-2'>
                                    <div className='text-gray-900 font-medium'>{tournoi.teams.length}</div>
                                </dd>
                            </div>
                            {tournoi.userId === session?.user?.id ? (
                                <div className='flex justify-center items-center gap-x-4 py-3'>
                                    <dt className='text-gray-500 text-center font-medium'>Vous avez creer ce tournoi</dt>
                                </div>
                            ) : null}
                            {isSubscribed ?

                                <ViewTeam teamId={inscription.id} tournoiId={id}/>
                                :
                                <>
                                    {tournoi.userId != session?.user.id ?
                                        <Link href={`/tournoi/${id}/suscribe`} className={buttonVariants({
                                            variant: "default",
                                            className: "w-full mb-6"
                                        })}>
                                            Inscrivez votre equipe 
                                        </Link>
                                        :
                                        null
                                    }
                                </>

                            }
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

