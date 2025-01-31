import {PropMapper} from "../PropMapper";
import {Color} from "../../../common/color";
import {BackgammonProp} from "../../board/backgammon/types";

export class BackgammonPropMapper implements PropMapper<BackgammonProp> {
    logicalToPhysical = (prop: BackgammonProp): Color[] => {
        if (prop === undefined) {
            return []
        }
        const res = []
        for (let i = 0; i < prop.quantity; ++i) {
            res.push(prop.color)
        }
        return res
    };

    PhysicalToLogical = (arr: Color[]): BackgammonProp => {
        if (arr.length === 0) {
            return undefined
        }
        return {color: arr[0], quantity: arr.length}
    };
}