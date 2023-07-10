"use client"
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'

interface props {
    tournoiId: string,
    teamId: string
}
export default function ViewTeam({teamId, tournoiId}:props) {
    const path = usePathname()
    
  return (
    <Link  href={`/tournoi/${tournoiId}/team/${teamId}`} className={buttonVariants({
        variant: "default",
        className: !path.includes("team") ? "w-full mb-6" : "hidden"
    })}>
        Voir Votre equipe
    </Link>
  )
}
