import {DoubleCubeConfig} from "../ConfigParser";
import {Color, oppositeColor} from "../../../common/color";
import {FetchType} from "../../../common/requests";
import {usernames} from "../../../requests/requests";

export type RemotePlayer = {
    id: number,
    username: string
}

export type RemoteDoubleCubePosition = "UNAVAILABLE" | "FREE" | "BELONGS_TO_WHITE" | "BELONGS_TO_BLACK" | "OFFERED_TO_WHITE" | "OFFERED_TO_BLACK"

export function mapRemoteDoubleCube(doubleCubePosition: RemoteDoubleCubePosition, doubleCubeValue: number | null)
    : DoubleCubeConfig {
    return doubleCubePosition === "UNAVAILABLE" ? {
        state: "unavailable"
    } : doubleCubePosition === "FREE" ? {
        state: "free"
    } : doubleCubePosition === "BELONGS_TO_WHITE" ? {
        state: "belongs_to_white",
        value: doubleCubeValue!
    } : doubleCubePosition === "BELONGS_TO_BLACK" ? {
        state: "belongs_to_black",
        value: doubleCubeValue!
    } : doubleCubePosition === "OFFERED_TO_WHITE" ? {
        state: "offered_to_white",
        value: doubleCubeValue!
    } : {
        state: "offered_to_black",
        value: doubleCubeValue!
    }
}

export type RemoteColor = "WHITE" | "BLACK"

export function mapRemoteColor(color: RemoteColor): Color {
    return color === "WHITE" ? Color.WHITE : Color.BLACK
}

export async function requestPlayers(fetch: FetchType, raw: ReturnType<JSON['parse']>) {
    const resp = await usernames(fetch, [raw.players.WHITE, raw.players.BLACK])
    if (!resp.ok) {
        throw new Error(String(resp))
    }
    const _usernames = await resp.json() as string[]

    raw.players.WHITE = {
        id: raw.players.WHITE,
        username: _usernames[0]
    } satisfies RemotePlayer

    raw.players.BLACK = {
        id: raw.players.BLACK,
        username: _usernames[1]
    } satisfies RemotePlayer
}

export interface RemoteConfig {
    blackPoints: number,
    whitePoints: number,
    threshold: number,
    players: {
        WHITE: RemotePlayer,
        BLACK: RemotePlayer
    },
    doubleCubeValue: number | null,
    doubleCubePosition: RemoteDoubleCubePosition,
    winner: RemoteColor | null
}

export function inferTurnFromCubePosition(doubleCubePosition: RemoteDoubleCubePosition, turn: RemoteColor): Color {
    return doubleCubePosition === "OFFERED_TO_WHITE" || doubleCubePosition === "OFFERED_TO_BLACK" ?
            oppositeColor(mapRemoteColor(turn)) :
            mapRemoteColor(turn)
}


