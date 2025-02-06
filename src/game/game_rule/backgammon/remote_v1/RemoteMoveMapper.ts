import {BackgammonIndex, isStore} from "../../../board/backgammon/types";
import {BackgammonRemoteMove} from "./types";
import {RemoteMoveMapper} from "../../RemoteMoveMapper";
import {Move} from "../../../board/move";
import {logger} from "../../../../logging/main";

const console = logger("game/game_rule/backgammon/remote_v1")

export class BackgammonRemoteMoveMapper implements RemoteMoveMapper<BackgammonRemoteMove, BackgammonIndex> {
    toRemote = (indices: Move<BackgammonIndex>): BackgammonRemoteMove => {
        const {from, to} = indices
        console.assert(!isStore(from))
        const fromI = from === "Black Bar" ? 0 : from === "White Bar" ? 25 : from as number
        const toI = to === "White Store" ? 0 : to === "Black Store" ? 25 : to as number
        return {
            from: fromI,
            to: toI
        }
    };

    fromRemote = (move: BackgammonRemoteMove): Move<BackgammonIndex> => {
        const {from, to} = move

        const fromI: BackgammonIndex = from === 0 ? "Black Bar" : from === 25 ? "White Bar" : from
        const toI: BackgammonIndex =
            to === -1 ? "Black Bar" :
            to === 0 ? "White Store" :
            to === 25 ? "Black Store" :
            to === 26 ? "White Bar" :
            to

        return {from: fromI, to: toI}
    };
}