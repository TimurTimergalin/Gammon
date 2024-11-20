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
    res.set(24, [Color.BLACK, 1])
    res.set(23, [Color.BLACK, 1])
    res.set(22, [Color.BLACK, 1])
    res.set(21, [Color.BLACK, 1])
    res.set(20, [Color.BLACK, 1])
    res.set(19, [Color.BLACK, 1])
    res.set(1, [Color.WHITE, 1])
    res.set(2, [Color.WHITE, 1])
    res.set(3, [Color.WHITE, 1])
    res.set(4, [Color.WHITE, 1])
    res.set(5, [Color.WHITE, 1])
    res.set(6, [Color.WHITE, 1])
    return res
}