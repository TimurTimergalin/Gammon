import {Color} from "../../../common/color";
import {CompoundMove, Move} from "../move";

export type NardeIndex = number | "White Store" | "Black Store"
export type NardeProp = undefined | { color: Color, quantity: number }
export type NardePlacement = Map<NardeIndex, NardeProp>
export type NardeMove = Move<NardeIndex>
export type NardeCompoundMove = CompoundMove<NardeIndex>

export const getStore = (player: Color): NardeIndex => {
    if (player == Color.WHITE) {
        return "White Store"
    }
    return "Black Store"
}

export const isStore = (index: NardeIndex): boolean => index === "White Store" || index === "Black Store"
export const isHome = (index: NardeIndex, color: Color) => {
    if (typeof index !== "number") {
        return false
    }
    if (color === Color.WHITE) {
        return 1 <= index && index <= 6
    }
    return 13 <= index && index <= 18
}

export const isHead = (index: NardeIndex, player: Color): boolean => {
    return player === Color.WHITE ? (index === 24) : (index === 12)
}

export const getValue = (index: NardeIndex, player: Color) => {
    if (typeof index === "number") {
        if (player === Color.WHITE) {
            return index
        }
        if (index <= 12) {
            return 12 + index
        }

        return index - 12
    }
    return 0
}

export const allIndices = () => {
    const res: NardeIndex[] = []
    for (let i = 1; i <= 24; ++i) {
        res.push(i)
    }
    res.push("Black Store", "White Store")
    return res
}

export const indicesOf = (player: Color) => {
    if (player === Color.WHITE) {
        return [
            24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
        ]
    }

    return [
        12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13
    ]
}

