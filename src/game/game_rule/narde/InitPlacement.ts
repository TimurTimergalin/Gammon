import {Board} from "../../board/Board";
import {NardeIndex, NardePlacement, NardeProp} from "../../board/narde/types";
import {Color} from "../../../common/color";
import {NardeBoard} from "../../board/narde/NardeBoard";

export function nardeDefaultPlacement(): Board<NardeIndex, NardeProp> {
    const res: NardePlacement = new Map()
    res.set(24, {
        color: Color.WHITE,
        quantity: 15
    })
    res.set(12, {
        color: Color.BLACK,
        quantity: 15
    })

    return new NardeBoard(res)
}