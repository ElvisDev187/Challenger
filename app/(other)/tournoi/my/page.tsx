

import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import Feed from './Feed'


const page = async () => {

  const session = await getAuthSession()

  const Mytournois = await db.tournoi.findMany({
    take: 10,
    where: {
      userId: session?.user.id
    },
    include: {
      teams: true,
      user: true,
      arbitres: true
    }
  })

  const MyResponsabilities = await db.tournoi.findMany({
    take: 10,
    where: {
      teams: {
        some: {
          responsableId: session?.user.id
        }
      }
    },
    include: {
      teams: true,
      user: true,
      arbitres: true
    }
  })



  return (
    
      <Feed MyResponsabilities={MyResponsabilities} Mytournois={Mytournois}/>
  )
}

export default page