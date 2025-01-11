import {PropMapping} from "../PropMapping.ts";
import {BackgammonPositionProp} from "./types.ts";
import {Color} from "../../color.ts";

export class BackgammonPropMapping implements PropMapping<BackgammonPositionProp> {
    logicalToPhysical(prop: BackgammonPositionProp): Color[] {
        if (prop === null) {
            return []
        }
        const res = []
        for (let i = 0; i < prop[1]; ++i) {
            res.push(prop[0])
        }
        return res
    }

    PhysicalToLogical(arr: Color[]): BackgammonPositionProp {
        if (arr.length === 0) {
            return null
        }
        return [arr[0], arr.length]
    }
}