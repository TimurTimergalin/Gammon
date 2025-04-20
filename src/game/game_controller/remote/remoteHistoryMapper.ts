import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper";
import {HistoryEncoder} from "../../game_rule/HistoryEncoder";
import {GameHistoryEntry} from "../../game_history_state/GameHistoryState";
import {Color} from "../../../common/color";

export type RemoteHistoryEntry<RemoteMove> = {
    type: "MOVE",
    moves: RemoteMove[],
    dice: [number,number]
} | {
    type: "OFFER_DOUBLE",
    newValue: number,
} | {
    type: "ACCEPT_DOUBLE"
} | {
    type: "GAME_END",
    white: number,
    black: number,
    winner: "WHITE" | "BLACK",
    iSurrendered: boolean
}

export function remoteHistoryMapper<RemoteMove, Index>(
    {remoteMoveMapper, historyEncoder, remoteHistoryEntry, player}: {
        remoteMoveMapper: RemoteMoveMapper<RemoteMove, Index>,
        historyEncoder: HistoryEncoder<Index>,
        remoteHistoryEntry: RemoteHistoryEntry<RemoteMove>,
        player: Color
    }): GameHistoryEntry {
    if (remoteHistoryEntry.type === "MOVE") {
        const moves = remoteHistoryEntry.moves.map(e => remoteMoveMapper.fromRemote(e))
        const encoded = historyEncoder.encode(moves, player)
        return {
            type: "move",
            dice: remoteHistoryEntry.dice,
            moves: encoded
        }
    }
    if (remoteHistoryEntry.type === "ACCEPT_DOUBLE") {
        return {
            type: "accept_double"
        }
    }
    if (remoteHistoryEntry.type === "OFFER_DOUBLE") {
        return {
            type: "offer_double",
            newValue: remoteHistoryEntry.newValue
        }
    }

    return {
        type: "game_end",
        white: remoteHistoryEntry.white,
        black: remoteHistoryEntry.black,
        winner: remoteHistoryEntry.winner === "WHITE" ? Color.WHITE : Color.BLACK,
        reason: remoteHistoryEntry.iSurrendered ? "Игрок сдался" : undefined
    }
}
