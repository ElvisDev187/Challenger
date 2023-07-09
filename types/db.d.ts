import type { Tournoi , User, Team, Arbitre} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | undefined
    arbitres: Arbitre[] | undefined
}