import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { TournoiValidator } from '@/lib/validators/tournoi'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, lieu, debut, inscriptionLimit, isFree, description, ageMax, cover, limit } = TournoiValidator.parse(body)

    // check if tournoi already exists
    const tournoiExists = await db.tournoi.findFirst({
      where: {
        name,
      },
    })

    if (tournoiExists) {
      return new Response('Tournoi already exists', { status: 409 })
    }

    // create tournoi and associate it with the user
    const tournoi = await db.tournoi.create({
      data: {
        name,
        ageMax,
        cover,
        description,
        debut,
        inscriptionLimit,
        isFree,
        userId: session.user.id,
        lieu,
        limit
      },
    })

   

    return new Response(tournoi.id)
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create tournoi', { status: 500 })
  }
}
