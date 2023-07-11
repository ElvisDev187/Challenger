
import { groupValidator } from '@/components/FormGroup'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PlayerPayload, TeamValidator } from '@/lib/validators/team'
import { z } from 'zod'


const LABELS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { items, tournoiId } = groupValidator.parse(body)
        // check if tournoi exists
        const tournoiExists = await db.tournoi.findFirst({
            where: {
                id: tournoiId,
                userId: session.user.id
            },
            include:{
                groups: true
            }
        })

        if (!tournoiExists) {
            return new Response('Tournoi doesnt exists', { status: 409 })
        }
        // On trouve le nombre de groupe qui existe deja pour ce tournoi
        const nbGroups = tournoiExists.groups.length

        const group = await db.poule.create({
            data: {
                tournoiId: tournoiExists.id,
                label: nbGroups == 0 ? LABELS[nbGroups] : LABELS[nbGroups+1]
            }
        })

        const updatedTeams = await db.team.updateMany({
            where:{
                id: {
                    in: items
                }
            },
            data:{
                pouleId: group.id
            }
        
        })

    return new Response(group.label)
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create team', { status: 500 })
    }
}
