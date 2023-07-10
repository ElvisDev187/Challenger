
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PlayerPayload, TeamValidator } from '@/lib/validators/team'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { name, palyer, tournoiId } = TeamValidator.parse(body)
        // check if tournoi already exists
        const tournoiExists = await db.tournoi.findFirst({
            where: {
                id: tournoiId,
            },
        })

        if (!tournoiExists) {
            return new Response('Tournoi doesnt exists', { status: 409 })
        }

        const AlredyHaveteam = await db.team.findFirst({
            where: {
                tournoiId: tournoiId,
                responsableId: session.user.id
            }
        })
        if (AlredyHaveteam) {
            return new Response('Vous avez deja une equipe dans ce tournoi', { status: 409 })
        }

        const SameName = await db.team.findFirst({
            where: {
                name,
                tournoiId,
            }
        })

        if (SameName) {
            return new Response('Une equipe a deja se nom dans ce tournoi', { status: 409 })
        }
       


        // create team and associate it with the user
        const team = await db.team.create({
            data: {
                responsableId: session.user.id,
                name,
                tournoiId,          
            },
        })

      const players =  palyer.map(async (player)=>{
            const res: PlayerPayload = await db.player.create({
                data:{
                    teamId: team.id,
                    name: player.name,
                    age: player.age,
                    poste: player.poste
                }
            })
            return res
        })



    return new Response(team.id)
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create team', { status: 500 })
    }
}
