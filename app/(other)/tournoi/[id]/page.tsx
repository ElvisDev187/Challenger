import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
interface PageProps {
  params: {
    id: string
  }
}
export default async function page({ params: { id } }: PageProps) {
  const session = await getAuthSession()
  const tournoi = await db.tournoi.findUnique({
    where: {
      id: id
    },
    include: {
      teams: {
        include: {
          responsable: true
        }
      },
      arbitres: true,
      tours: {
        include: {
          matchs: true
        }
      }
    }
  })

  if (!tournoi) return notFound();

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
