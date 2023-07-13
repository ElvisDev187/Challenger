

import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import Feed from './Feed'


const page = async () => {

  const session = await getAuthSession()

  const Mytournois = await db.tournoi.findMany({
    take: 10,
    where: {
      userId: session?.user.id || ""
    },
    include: {
      Setting: true,
      user: true,
      teams: {
        include: {
          responsable: true
        }
      },
      arbitres: {
        include: {
          matchs: true
        }
      },
      tours: {
        include: {
          matchs: {
            include: {
              equipeIn: true,
              equipeOut: true,
              arbitre:{
                include: {
                  matchs: true
                }
              },
              Assistant: {
                include: {
                  matchs: true
                }
              }
            }
          }
        }
      },
      assistants: {
        include: {
          matchs: true
        }
      },
      groups: {
        include: {
          Team: true
        }
      },


    }
  })

  const MyResponsabilities = await db.tournoi.findMany({
    take: 10,
    where: {
      teams: {
        some: {
          responsableId: session?.user.id || ""
        }
      }
    },
    include: {
      Setting: true,
      user: true,
      teams: {
        include: {
          responsable: true
        }
      },
      arbitres: {
        include: {
          matchs: true
        }
      },
      tours: {
        include: {
          matchs: {
            include: {
              equipeIn: true,
              equipeOut: true,
              arbitre:{
                include: {
                  matchs: true
                }
              },
              Assistant: {
                include: {
                  matchs: true
                }
              }
            }
          }
        }
      },
      assistants: {
        include: {
          matchs: true
        }
      },
      groups: {
        include: {
          Team: true
        }
      },


    }
  })

  const MysTaff =await db.tournoi.findMany({
    where:{
      OR: [
        {
          arbitres: {
            some: {
              email: session?.user.email || ""
            }
          }
        },
        {
          assistants: {
            some: {
              email: session?.user.email || ""
            }
          }
        }
      ]
    },
    include: {
      Setting: true,
      user: true,
      teams: {
        include: {
          responsable: true
        }
      },
      arbitres: {
        include: {
          matchs: true
        }
      },
      tours: {
        include: {
          matchs: {
            include: {
              equipeIn: true,
              equipeOut: true,
              arbitre:{
                include: {
                  matchs: true
                }
              },
              Assistant: {
                include: {
                  matchs: true
                }
              }
            }
          }
        }
      },
      assistants: {
        include: {
          matchs: true
        }
      },
      groups: {
        include: {
          Team: true
        }
      },


    }
  })



  return (
    
      <Feed MyResponsabilities={MyResponsabilities} Mytournois={Mytournois} MysTaff={MysTaff}/>
  )
}

export default page
