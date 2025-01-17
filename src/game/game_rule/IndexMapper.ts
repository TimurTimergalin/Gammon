export interface IndexMapper<Index> {
    logicalToPhysical(logical: Index): number

    physicalToLogical(physical: number): Index

    flipped(): IndexMapper<Index>
}