import {PropMapper} from "../PropMapper";
import {NardeProp} from "../../board/narde/types";
import {Color} from "../../../common/color";

export class NardePropMapper implements PropMapper<NardeProp> {
    logicalToPhysical = (prop: NardeProp): Color[] => {
        if (prop === undefined) {
            return []
        }
        const res = []
        for (let i = 0; i < prop.quantity; ++i) {
            res.push(prop.color)
        }
        return res
    };

    physicalToLogical = (arr: Color[]): NardeProp => {
        if (arr.length === 0) {
            return undefined
        }
        return {color: arr[0], quantity: arr.length}
    };
}