
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UpdateMatchValidator } from '@/lib/validators/match'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const {matchId, assistantId, arbitreId, terrain, time, date} = UpdateMatchValidator.parse(body)
        const update = await db.match.update({
            where: {
                id: matchId
            },
            data: {
                arbitreId,
                assistantId,
                terrain,
                date,
                heure: time
            }
        })


    return new Response("ok", {status: 200})
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not update match', { status: 500 })
    }
}
