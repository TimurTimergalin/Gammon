export interface IndexMapping<PositionIndexType> {
    logicalToPhysical(logical: PositionIndexType): number
    physicalToLogical(physical: number): PositionIndexType
    flipped(): IndexMapping<PositionIndexType>
}