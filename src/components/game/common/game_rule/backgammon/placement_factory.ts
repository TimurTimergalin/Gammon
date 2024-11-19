import {BackgammonPositionIndex, BackgammonPositionProp} from "./types.ts";
import {Color} from "../../color.ts";

export function backgammonDefaultPlacement(): Map<BackgammonPositionIndex, BackgammonPositionProp> {
    const res: Map<BackgammonPositionIndex, BackgammonPositionProp> = new Map()
    res.set(24, [Color.WHITE, 2])
    res.set(19, [Color.BLACK, 5])
    res.set(17, [Color.BLACK, 3])
    res.set(13, [Color.WHITE, 5])
    res.set(12, [Color.BLACK, 5])
    res.set(8, [Color.WHITE, 3])
    res.set(6, [Color.WHITE, 5])
    res.set(1, [Color.BLACK, 2])
    return res
}

export function backgammonDebugPlacement(): Map<BackgammonPositionIndex, BackgammonPositionProp> {
    const res: Map<BackgammonPositionIndex, BackgammonPositionProp> = new Map()
    res.set(24, [Color.WHITE, 1])
    res.set(19, [Color.BLACK, 1])
    res.set(17, [Color.BLACK, 1])
    res.set(13, [Color.WHITE, 1])
    res.set(12, [Color.BLACK, 1])
    res.set(8, [Color.WHITE, 1])
    res.set(6, [Color.WHITE, 1])
    res.set(1, [Color.BLACK, 1])
    res.set("Black Bar", [Color.BLACK, 1])
    res.set("White Bar", [Color.WHITE, 1])
    return res
}