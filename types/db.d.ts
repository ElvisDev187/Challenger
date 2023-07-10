import type { Tournoi , User, Team, Arbitre, Player, Match, InfoMatch, Assistant} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | undefined
    arbitres: Arbitre[] | undefined,
    assistants: Assistant[]
}

export type ExtendedTeam = Team & {
    responsable: User
    players:       Player[]
    matchIns:      Match[]    
    matchOuts :    Match[]    
    infoMatchs:    InfoMatch[]
}