import {RemoteMoveMapper} from "../RemoteMoveMapper.ts";
import {BackgammonPositionIndex, BackgammonRemoteMove, isStore} from "./types.ts";

export class BackgammonRemoteMoveMapper implements RemoteMoveMapper<BackgammonRemoteMove, BackgammonPositionIndex> {
    toRemote(indices: [BackgammonPositionIndex, BackgammonPositionIndex]): BackgammonRemoteMove {
        const [from, to] = indices
        console.assert(!isStore(from))
        const fromI = from === "Black Bar" ? 0 : from === "White Bar" ? 25 : from as number
        const toI = to === "White Store" ? 0 : to === "Black Store" ? 25 : to as number
        return {
            from: fromI,
            to: toI
        }
    }

    fromRemote(move: BackgammonRemoteMove): [BackgammonPositionIndex, BackgammonPositionIndex] {
        const {from, to} = move

        const fromI: BackgammonPositionIndex = from === 0 ? "Black Bar" : from === 25 ? "White Bar" : from
        const toI: BackgammonPositionIndex =
            to === -1 ? "Black Bar" :
            to === 0 ? "White Store" :
            to === 25 ? "Black Store" :
            to === 26 ? "White Bar" :
            to

        return [fromI, toI]
    }
}