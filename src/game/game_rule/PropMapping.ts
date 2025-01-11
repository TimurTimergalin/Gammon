import {Color} from "../color.ts";

export interface PropMapping<PositionPropsType> {
    logicalToPhysical(prop: PositionPropsType): Color[]

    PhysicalToLogical(arr: Color[]): PositionPropsType
}