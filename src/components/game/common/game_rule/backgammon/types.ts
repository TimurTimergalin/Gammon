import {Color} from "../../color.ts";

export type BackgammonPositionIndex = number | "White Store" | "Black Store" | "White Bar" | "Black Bar"
export type BackgammonPositionProp = null | [Color, number]

export const getBar = (player: Color): BackgammonPositionIndex => {
    if (player == Color.WHITE) {
        return "White Bar"
    }
    return "Black Bar"
}
export const getStore = (player: Color): BackgammonPositionIndex => {
    if (player == Color.WHITE) {
        return "White Store"
    }
    return "Black Store"
}

export const isBar = (index: BackgammonPositionIndex): boolean => index === "White Bar" || index === "Black Bar"
export const isStore = (index: BackgammonPositionIndex): boolean => index === "White Store" || index === "Black Store"
export const getValue = (index: BackgammonPositionIndex): number => {
    if (typeof index === "number") {
        return index
    }
    if (index === "White Bar" || index === "Black Store") {
        return 25
    }
    return 0
}

export const allIndices = () => {
    const res: BackgammonPositionIndex[] = []
    for (const i of Array(24).keys()) {
        res.push(i + 1)
    }
    res.push("White Bar", "White Store", "Black Bar", "Black Store")
    return res
}