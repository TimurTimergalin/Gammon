export type BackgammonRemoteMove = {
    from: number,
    to: number
}

export type BackgammonRemotePlayer = {
    id: number,
    username: string
}

export interface BackgammonRemoteConfig {
    gameData: {
        color: "BLACK" | "WHITE",
        turn: "BLACK" | "WHITE",
        first: boolean,
        bar: {
            WHITE: number,
            BLACK: number
        },
        deck: {
            color: "BLACK" | "WHITE",
            count: number,
            id: number
        }[],
        zar: [number, number] | [],
    },
    blackPoints: number,
    whitePoints: number,
    threshold: number,
    players: {
        WHITE: BackgammonRemotePlayer,
        BLACK: BackgammonRemotePlayer
    }
}