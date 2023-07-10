"use client"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import type { Tournoi } from '@prisma/client'
import FilterBar from '@/components/FilterBar'
import { Loader2 } from 'lucide-react'
import TournoiCard from '@/components/Tournoi'
import { ExtendedTournoi } from '@/types/db'
export default function page() {
  const {data, isLoading } = useQuery(
    ["tournois"],
    async () => {
      const { data } = await axios.get('api/tournoi/get')
      return data as ExtendedTournoi[]
    },
    {
      onSuccess(data) {
        console.log(data);

      },
    }
  )
  return (
    <div className=''>
      <FilterBar />
      <div className='mt-5 grid grid-cols-3 p-7 gap-5'>
        {isLoading?
        <Loader2 className='h-14 w-14 animate-spin'/>
        :
        <>
          {data?.length && data.map((tournoi)=>(
            <TournoiCard staff={false}  tournoi={tournoi} key={tournoi.id}/>
          ))}
        </>
      }

      </div>
    </div>
  )
}
