
import { generateSuscribeMessage, transporter } from '@/lib/config'
import { db } from '@/lib/db'
import { InfoValidator } from '@/lib/validators/match'
import { z } from 'zod'

export async function POST(req: Request) {
    try {      
        const body = await req.json()
        const { type, matchId, minute, playerId, equipeId } = InfoValidator.parse(body)

        

    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create team', { status: 500 })
    }
}
