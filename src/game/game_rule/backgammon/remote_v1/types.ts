import {RemoteColor, RemoteConfig} from "../../common_remote/common";
import {Move} from "../../../board/move";

export type BackgammonRemoteMove = Move<number>

export type BackgammonRemoteConfig = {
    gameData: {
        color: RemoteColor | null,
        turn: RemoteColor,
        first: boolean,
        bar: {
            WHITE: number,
            BLACK: number
        },
        deck: {
            color: RemoteColor,
            count: number,
            id: number
        }[],
        zar: [number, number] | [],
    }
} & RemoteConfig