import {Color} from "../color.ts";

export interface PropMapper<Prop> {
    logicalToPhysical(prop: Prop): Color[]

    PhysicalToLogical(arr: Color[]): Prop
}