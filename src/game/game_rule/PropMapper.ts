import {Color} from "../../common/color.ts";

export interface PropMapper<Prop> {
    logicalToPhysical(prop: Prop): Color[]

    PhysicalToLogical(arr: Color[]): Prop
}