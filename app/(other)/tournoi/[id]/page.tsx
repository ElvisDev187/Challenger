import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
import General from './General'
import Admin from './Admin'
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
      user: true,
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
      },
      assistants: true
    }
  })

  if (!tournoi) return notFound();
  

  return (
    <> 
      {tournoi.userId !== session?.user.id? <General tournoi={tournoi}/> : <Admin tournoi={tournoi}/>}
    </>
  )
}
