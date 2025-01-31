import {Color} from "../../../common/color";
import {BackgammonBoard} from "../../board/backgammon/BackgammonBoard";
import {Board} from "../../board/Board";
import {BackgammonIndex, BackgammonPlacement, BackgammonProp} from "../../board/backgammon/types";

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
    const placement: BackgammonPlacement = new Map([
            [1, {color: Color.BLACK, quantity: 1}],
            [2, {color: Color.WHITE, quantity: 2}],
            [3, {color: Color.WHITE, quantity: 2}],
            [6, {color: Color.WHITE, quantity: 6}],
            [8, {color: Color.WHITE, quantity: 1}],
            [12, {color: Color.BLACK, quantity: 3}],
            [13, {color: Color.WHITE, quantity: 3}],
            [17, {color: Color.BLACK, quantity: 5}],
            [19, {color: Color.BLACK, quantity: 6}],
            [24, {color: Color.WHITE, quantity: 2}]
        ])

    return new BackgammonBoard(placement)
}