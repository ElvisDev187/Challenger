
import { db } from '@/lib/db'
import { z } from 'zod'

export async function POST(req: Request) {
    try {      
        const body = await req.json()
        const res = await db.match.update({
            where: {
                id: body.id,
            },
            data:{
                status: "EN_COURS"
            }
        })
 
        return new Response("ok", { status: 200 })       

    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create team', { status: 500 })
    }
}
