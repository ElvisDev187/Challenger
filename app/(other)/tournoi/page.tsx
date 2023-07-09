"use client"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import type { Tournoi } from '@prisma/client'
export default function page() {
    const { } = useQuery(
        ["tournois"],
        async()=>{
          const {data} = await axios.get('api/tournoi/get')
          return data as Tournoi[]
        },
        {
            onSuccess(data) {
                console.log(data);
                
            },
        }
    )
  return (
    <div className='bg-white'>
      Tournoi
    </div>
  )
}
