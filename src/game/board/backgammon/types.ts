import {Color} from "../../../common/color.ts";
import {CompoundMove, Move} from "../move.ts";

export type BackgammonIndex = number | "White Store" | "Black Store" | "White Bar" | "Black Bar"
export type BackgammonProp = undefined | {color: Color, quantity: number}
export type BackgammonPlacement = Map<BackgammonIndex, BackgammonProp>
export type BackgammonMove = Move<BackgammonIndex>
export type BackgammonCompoundMove = CompoundMove<BackgammonIndex>
export const getBar = (player: Color): BackgammonIndex => {
    if (player == Color.WHITE) {
        return "White Bar"
    }
    return "Black Bar"
}
export const getStore = (player: Color): BackgammonIndex => {
    if (player == Color.WHITE) {
        return "White Store"
    }
    return "Black Store"
}
export const isBar = (index: BackgammonIndex): boolean => index === "White Bar" || index === "Black Bar"
export const isStore = (index: BackgammonIndex): boolean => index === "White Store" || index === "Black Store"
export const isHome = (index: BackgammonIndex, player: Color) => {
    if (typeof index !== "number") {
        return false
    }
    if (player === Color.WHITE) {
        return index <= 6
    }
    return index >= 19
}
export const getValue = (index: BackgammonIndex): number => {
    if (typeof index === "number") {
        return index
    }
    if (index === "White Bar" || index === "Black Store") {
        return 25
    }
    return 0
}
export const allIndices = () => {
    const res: BackgammonIndex[] = []
    for (const i of Array(24).keys()) {
        res.push(i + 1)
    }
    res.push("White Bar", "White Store", "Black Bar", "Black Store")
    return res
}