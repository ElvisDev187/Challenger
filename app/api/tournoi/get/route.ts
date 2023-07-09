import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { TournoiValidator } from '@/lib/validators/tournoi'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
   const tournois = await db.tournoi.findMany({take: 10, 
    include: {
      teams: true,
      user: true,
      arbitres: true
   }})
   return new Response(JSON.stringify(tournois))
  } catch (error) {

   
    return new Response('Could not create tournoi', { status: 500 })
  }
}
