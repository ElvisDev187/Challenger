import type { ExtendedTournoi } from '@/types/db'
import Image from 'next/image'
import React from 'react'

interface Props {
    tournoi: ExtendedTournoi
}
export default function General({ tournoi }: Props) {
    return (
        <>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
                {tournoi.name}
            </h1>
            <section className='w-full flex flex-col h-fit mt-8 items-start gap-5 justify-center'>
                <div className='aspect-video relative w-[600px]'>
                    <Image
                        fill
                        src={tournoi.cover}
                        alt='profile picture'
                        referrerPolicy='no-referrer'
                    />
                </div>
                <div className='w-full'>
                    <p className='text-slate-700 text-md leading-3'>{tournoi.description}</p>
                </div>
            </section>
              {/* arbre pour le tournoi */}
        </>
    )
}
