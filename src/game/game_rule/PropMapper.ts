import {Color} from "../../common/color";

export interface PropMapper<Prop> {
    logicalToPhysical(prop: Prop): Color[]

    PhysicalToLogical(arr: Color[]): Prop
}