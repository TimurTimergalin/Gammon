import {Move} from "../board/move";

export interface RemoteMoveMapper<RemoteMove, Index> {
    toRemote(move: Move<Index>): RemoteMove
    fromRemote(move: RemoteMove): Move<Index>
}