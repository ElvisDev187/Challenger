import { ExtendedTeam } from './db.d';
import type { Tournoi , User, Team, Arbitre, Player, Match, InfoMatch, Assistant, Tour, Poule, Setting} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | null
    arbitres: ExtendedArb[] | null,
    assistants: ExtendedAss[] | null,
    tours: ExtendedTour[] | null,
    groups: ExtendedPoule[] |  null,
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
    matchs: ExtendedMatch[] | null,
}
export type ExtendedArb = Arbitre & {
    matchs: Match[] | null
}
export type ExtendedAss = Assistant & {
    matchs: Match[] | null
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
    Team: Team[] | null
}