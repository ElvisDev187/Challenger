import { ExtendedTeam } from './db.d';
import type { Tournoi , User, Team, Arbitre, Player, Match, InfoMatch, Assistant, Tour, Poule, Setting} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | undefined
    arbitres: ExtendedArb[],
    assistants: ExtendedAss[],
    tours: ExtendedTour[],
    groups: ExtendedPoule[],
    Setting: Setting | null
}

export type ExtendedTeam = Team & {
    responsable: User
    players:       Player[]
    matchIns:      Match[]    
    matchOuts :    Match[]    
    infoMatchs:    InfoMatch[]
}

export type ExtendedTour = Tour & {
    matchs: ExtendedMatch[] | undefined,
}
export type ExtendedArb = Arbitre & {
    matchs: Match[]
}
export type ExtendedAss = Assistant & {
    matchs: Match[]
}
export type ExtendedMatch = Match & {
    equipeIn: Team,
    equipeOut: Team,
    arbitre: ExtendedArb,
    Assistant: ExtendedAss
}
export type ExtendedMatch2 = Match & {
    equipeIn: Team,
    equipeOut: Team,
    arbitre: Arbitre |null,
    Assistant: Assistant|null,
    infoMatchs:    InfoMatch[]
}
export type ExtendedPoule = Poule & {
    Team: Team[] | undefined
}