import {PiecePlacement, PositionState} from "../board/physical/types";
import {IndexMapper} from "./IndexMapper";
import {PropMapper} from "./PropMapper";

export function logicalToPhysical<Index, Prop>(
    ruleBoard: Iterable<[Index, Prop]>,
    indexMapper: IndexMapper<Index>,
    propMapper: PropMapper<Prop>
) {
    const physical: PiecePlacement = new Map()
    for (const [ind, val] of ruleBoard) {
        const physicalInd = indexMapper.logicalToPhysical(ind)
        const physicalProp = new PositionState(
            propMapper.logicalToPhysical(val).map(color => ({color: color}))
        )
        physical.set(physicalInd, physicalProp)
    }
    return physical
}

export function physicalToLogical<Index, Prop>(
    physicalBoard: Iterable<[number, PositionState]>,
    indexMapper: IndexMapper<Index>,
    propMapper: PropMapper<Prop>
) {
    const logical: Map<Index, Prop> = new Map()

    for (const [ind, val] of physicalBoard) {
        const logicalInd = indexMapper.physicalToLogical(ind)
        const logivalProp = propMapper.physicalToLogical(val.pieceArray())
        logical.set(logicalInd, logivalProp)
    }
    return logical
}