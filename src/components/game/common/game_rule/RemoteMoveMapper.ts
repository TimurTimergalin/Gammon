export interface RemoteMoveMapper<RemoteMoveType, PositionIndexType> {
    toRemote(indices: [PositionIndexType, PositionIndexType]): RemoteMoveType
    fromRemote(move: RemoteMoveType): [PositionIndexType, PositionIndexType]
}