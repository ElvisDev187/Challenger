import type { Tournoi , User, Team, Arbitre, Player, Match, InfoMatch} from "@prisma/client";

export type ExtendedTournoi = Tournoi & {
    user: User
    teams: Team[] | undefined
    arbitres: Arbitre[] | undefined
}

export type ExtendedTeam = Team & {
    responsable: User
    players:       Player[]
    matchIns:      Match[]    
    matchOuts :    Match[]    
    infoMatchs:    InfoMatch[]
}