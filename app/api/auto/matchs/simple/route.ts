import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { AutoActionValidator } from '@/lib/validators/auto'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { tournoiId } = AutoActionValidator.parse(body)


        // check if tournoi already exists
        const tournoiExists = await db.tournoi.findFirst({
            where: {
                id: tournoiId,
                userId: session.user.id
            },
            include:{
                Setting: true,
                teams: true
            }
        })

        if (!tournoiExists) {
            return new Response('Tournoi dosent exists', { status: 409 })
        }

        if(tournoiExists.Setting?.mode === "SIMPLE"){
            if(tournoiExists.Setting.limit_teams != tournoiExists.teams.length){
                return new Response('Unauthorized', { status: 405 })
            }

            const teams = tournoiExists.teams
            let exclus: string[] = []
            const tour =  await db.tour.create({
                data:{
                    tournoiId,
                    rang: 1,
                    isElimination: false
                }
            })

            teams.map((team)=>{
                teams.map(async (adversaire)=>{
                    if (team.id != adversaire.id && !exclus.includes(adversaire.id)) {
                        await db.match.create({
                            data:{
                                equipeInId: team.id,
                                equipeOutId: adversaire.id,
                                tourId: tour.id
                            }
                        })
                    }
                })
                exclus = [...exclus, team.id]
            })
        }
       
        return new Response("Ok", {status: 200})
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create tournoi', { status: 500 })
    }
}
