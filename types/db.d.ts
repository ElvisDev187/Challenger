import { ExtendedTeam } from './db.d';
import type { Tournoi , User, Team, Arbitre, Player, Match, InfoMatch, Assistant, Tour} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | undefined
    arbitres: Arbitre[] | undefined,
    assistants: Assistant[] | undefined,
    tours: ExtendedTour[] | undefined
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