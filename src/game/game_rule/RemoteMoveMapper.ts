import {Move} from "../board/move.ts";

export interface RemoteMoveMapper<RemoteMove, Index> {
    toRemote(indices: Move<Index>): RemoteMove
    fromRemote(move: RemoteMove): Move<Index>
}