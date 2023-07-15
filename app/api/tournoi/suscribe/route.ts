
import { generateSuscribeMessage, transporter } from '@/lib/config'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function POST(req: Request) {
    try {      
        const body = await req.json()
        const EXIST = await db.suscriber.findFirst({
            where:{
                email: body.email,
                tournoiId: body.tournoiId
            }
        })

        if(EXIST){
            return new Response("Duplicate",{status: 400})
        }

        const suscriber = await db.suscriber.create({
            data:{
                tournoiId: body.tournoiId,
                email: body.email
            },
            include:{
                tournoi:true
            }
        })


        try {
            await transporter.sendMail({
              from: "noreply@challenger.com",
              to: suscriber.email,
             ...generateSuscribeMessage(suscriber.email, suscriber?.tournoi?.name),
              subject: "Information",
            });
      
            return new Response("OK",{status: 200})

          } catch (err) {
            console.log(err);
            return new Response('Could not create Staff', { status: 500 })
          } 


       

   
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create team', { status: 500 })
    }
}
