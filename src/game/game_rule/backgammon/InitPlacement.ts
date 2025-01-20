import {Color} from "../../../common/color.ts";
import {BackgammonBoard} from "../../board/backgammon/BackgammonBoard.ts";
import {Board} from "../../board/Board.ts";
import {BackgammonIndex, BackgammonPlacement, BackgammonProp} from "../../board/backgammon/types.ts";

export function backgammonDefaultPlacement(): Board<BackgammonIndex, BackgammonProp> {
    const res: BackgammonPlacement = new Map()
    res.set(24, {
        color: Color.WHITE,
        quantity: 2
    })
    res.set(19, {
        color: Color.BLACK,
        quantity: 5
    })
    res.set(17, {
        color: Color.BLACK,
        quantity: 3
    })
    res.set(13, {
        color: Color.WHITE,
        quantity: 5
    })
    res.set(12, {
        color: Color.BLACK,
        quantity: 5
    })
    res.set(8, {
        color: Color.WHITE,
        quantity: 3
    })
    res.set(6, {
        color: Color.WHITE,
        quantity: 5
    })
    res.set(1, {
        color: Color.BLACK,
        quantity: 2
    })
    return new BackgammonBoard(res)
}

export function backgammonDebugPlacement(): Board<BackgammonIndex, BackgammonProp> {
    const res: BackgammonPlacement = new Map()

    res.set(5, {color: Color.WHITE, quantity: 1})

    return new BackgammonBoard(res)
}