import { Tournoi } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Banknote, MapIcon, MapPin, UserCheck, Users } from 'lucide-react'
import type { ExtendedTournoi } from '@/types/db'

interface CardProps{
    tournoi: ExtendedTournoi,
    staff: boolean | undefined
}

export default function TournoiCard({ tournoi:{ id, cover, isFree, name, lieu, ageMax, teams, prix }, staff}: CardProps) {
    return (
        <Link href={staff?`/tournoi/${id}/staff`:`/tournoi/${id}`} passHref>
            <div className='flex flex-wrap p-5  justify-start cursor-pointer shadow-md rounded-md border bg-white'>
                <div className='w-[400px] h-[260px] overflow-hidden rounded-sm '>
                    <Image src={cover} width={400} height={260} alt='cover' className='object-cover' />
                </div>
                <div className='w-full flex flex-col items-start'>
                    <div className='pt-2 items-center justify-between flex'>
                        <div className='flex items-center'>
                            <div className='pr-3 text-green-400'><Banknote /></div>
                            <p className='font-bold text-md'>{isFree ? 'Free' : prix}</p>
                        </div>
                    </div>
                    <div className='flex items-center p-1 justify-between w-[250px] gap-2 flex-nowrap md:w-full mt-2'>

                        <div className='flex gap-1 flex-nowrap'>
                            <MapPin  className='text-blue-400' /> {lieu}
                        </div> 
                        <div className='flex gap-1 flex-nowrap'>
                            <UserCheck className='text-blue-400' /> - {ageMax} ans
                        </div>
                        <div className='flex gap-1 flex-nowrap'>
                            <Users className='text-blue-400'/> {teams?.length || 0} inscrit(s)
                        </div>
                    </div>
                    <p className='text-lg font-semibold mt-2'>
                        {name.length > 30 ? name.substring(0, 30) + '...' : name}
                    </p>
                </div>
            </div>
        </Link>
    )
}
