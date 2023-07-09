import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'
interface PageProps {
  params: {
    id: string
  }
}
export default async function page({params: {id}}:PageProps) {
  const session = await getAuthSession()
  const tournoi = await db.tournoi.findUnique({
    where:{
      id: id
    },
    include:{
      teams: {
        include:{
          responsable: true
        }
      },
      arbitres: true,
      tours: {
        include:{
          matchs: true
        }
      }
    }
  })

  if(!tournoi) return notFound();

  return (
    <>
     <h1 className='font-bold text-3xl md:text-4xl h-14'>
        {tournoi.name}
      </h1>
    </>
  )
}
