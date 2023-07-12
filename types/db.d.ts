import { ExtendedTeam } from './db.d';
import type { Tournoi , User, Team, Arbitre, Player, Match, InfoMatch, Assistant, Tour, Poule} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | undefined
    arbitres: Arbitre[] | undefined,
    assistants: Assistant[] | undefined,
    tours: ExtendedTour[] | undefined,
    groups: ExtendedPoule[] | undefined
}

export type ExtendedTeam = Team & {
    responsable: User
    players:       Player[]
    matchIns:      Match[]    
    matchOuts :    Match[]    
    infoMatchs:    InfoMatch[]
}

type ExtendedTour = Tour & {
    matchs: Match[] | undefined
}
export type ExtendedPoule = Poule & {
    Team: Team[] | undefined
}