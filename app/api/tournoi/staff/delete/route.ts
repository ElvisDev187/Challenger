import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { DelStaffValidator } from '@/lib/validators/staff'
import { generateDeleteMessage, generateEmailContent, transporter } from '@/lib/config'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { id, tournoiId, role } = DelStaffValidator.parse(body);

        const tournoiExist = await db.tournoi.findFirst({
            where: {
                id: tournoiId,
                userId: session.user.id
            },
        })

        if (!tournoiExist) {
            return new Response('Tournoi doesent exists', { status: 409 })
        }

        if (role === "ARBITRE") {
            const verif = await db.arbitre.findFirst({
                where:{
                    id,
                    tournoiId
                }, 
                include:{
                    tournoi: {
                       select:{
                        name: true
                       }
                    }
                }
            })

            const arbitre = await db.arbitre.delete({
                where: {
                    id: verif?.id || ""
                }
            })

            try {
                await transporter.sendMail({
                  from: "noreply@challenger.com",
                  to: verif?.email,
                 ...generateDeleteMessage(verif?.name || "", verif?.tournoi.name || ""),
                  subject: "Information",
                });
          
                return new Response(verif?.tournoiId)

              } catch (err) {
                console.log(err);
                return new Response('Could not delete Staff', { status: 500 })
              }


        } else {

            const verif = await db.assistant.findFirst({
                where:{
                    id,
                    tournoiId
                }, 
                include:{
                    tournoi: {
                       select:{
                        name: true
                       }
                    }
                }
            })
            const assistant = await db.assistant.delete({
                where: {
                    id: verif?.id || ""
                }
            })

            try {
                await transporter.sendMail({
                  from: "noreply@challenger.com",
                  to: verif?.email,
                 ...generateDeleteMessage(verif?.name || "", verif?.tournoi.name || ""),
                  subject: "Information",
                });
          
                return new Response(verif?.tournoiId)

              } catch (err) {
                console.log(err);
                return new Response('Could not delete Staff', { status: 500 })
              }


        }


    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create Staff', { status: 500 })
    }
}
