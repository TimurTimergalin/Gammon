import {Color} from "../../common/color";

export interface PropMapper<Prop> {
    logicalToPhysical(prop: Prop): Color[]

    physicalToLogical(arr: Color[]): Prop
}