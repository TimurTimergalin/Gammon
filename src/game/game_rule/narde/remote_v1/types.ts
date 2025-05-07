import {Move} from "../../../board/move";
import {RemoteColor, RemoteConfig} from "../../common_remote/common";

export type NardeRemoteMove = Move<number>

export type NardeRemoteConfig = {
    gameData: {
        color: RemoteColor | null,
        turn: RemoteColor,
        deck: {
            color: RemoteColor,
            count: number,
            id: number
        }[],
        zar: [number, number] | []
    }
} & RemoteConfig