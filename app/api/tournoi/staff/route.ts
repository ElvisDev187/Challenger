import { getAuthSession } from '@/lib/auth'
import { generateEmailContent, transporter } from '@/lib/config'
import { db } from '@/lib/db'
import { StaffValidator } from '@/lib/validators/staff'
import { TournoiValidator } from '@/lib/validators/tournoi'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { email, tournoiId, name, role } = StaffValidator.parse(body)

        const tournoiExist = await db.tournoi.findFirst({
            where: {
                id: tournoiId
            },
        })

        if (!tournoiExist) {
            return new Response('Tournoi doesent exists', { status: 409 })
        }


        if (role.toUpperCase() === "ARBITRE") {
            // check if arbitre already exists
            const ArbExists = await db.arbitre.findFirst({
                where: {
                    tournoiId: tournoiId,
                    email: email
                },
            })

            if (ArbExists) {
                return new Response('Tournoi already exists', { status: 409 })
            }

            // create tournoi and associate it with the user
            const arbitre = await db.arbitre.create({
                data: {
                    name,
                    tournoiId,
                    email
                }
                ,
                include:{
                    tournoi: {
                       select: {
                        name: true
                       }
                    }
                }
            })
            try {
                await transporter.sendMail({
                  from: "noreply@challenger.com",
                  to: arbitre.email,
                 ...generateEmailContent("Arbitre",arbitre.name,arbitre.tournoi.name),
                  subject: "Information",
                });
          
                return new Response(arbitre.tournoiId)

              } catch (err) {
                console.log(err);
                return new Response('Could not create Staff', { status: 500 })
              }

            
        } else {
            // check if arbitre already exists
            const AssExists = await db.assistant.findFirst({
                where: {
                    tournoiId: tournoiId,
                    email: email
                },
            })

            if (AssExists) {
                return new Response('Tournoi already exists', { status: 409 })
            }

            // create tournoi and associate it with the user
            const assistant = await db.assistant.create({
                data: {
                    name,
                    tournoiId,
                    email
                },
                include:{
                    tournoi: {
                       select: {
                        name: true
                       }
                    }
                }
            })
            
            try {
                await transporter.sendMail({
                  from: "noreply@challenger.com",
                  to: assistant.email,
                 ...generateEmailContent("Assistant",assistant.name,assistant.tournoi.name),
                  subject: "Information",
                });
          
                return new Response(assistant.tournoiId)

              } catch (err) {
                console.log(err);
                return new Response('Could not create Staff', { status: 500 })
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
