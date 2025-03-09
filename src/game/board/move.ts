import {Color} from "../../common/color";
import {Rules} from "../game_rule/Rules";

export interface Move<T> {
    from: T,
    to: T
}

export function invert<T>(move: Move<T>): Move<T> {
    return {
        from: move.to,
        to: move.from
    }
}

export interface CompoundMove<T> {
    primaryMove: Move<T>,
    additionalMoves: Move<T>[],
    dice: number[]
}

export function invertCompound<T>(compoundMove: CompoundMove<T>): CompoundMove<T> {
    return {
        dice: compoundMove.dice,
        primaryMove: invert(compoundMove.primaryMove),
        additionalMoves: compoundMove.additionalMoves.map(invert).reverse()
    }
}

export function mergeMoves<T>(moves: Move<T>[]): Move<T>[] {
    const res: Map<T, Move<T>[]> = new Map()

    for (const move of moves) {
        if (res.has(move.from)) {
            const oldMoves = res.get(move.from)!
            const oldMove = oldMoves.pop()!
            if (oldMoves.length === 0) {
                res.delete(move.from)
            }
            const newMove: Move<T> = {from: oldMove.from, to: move.to}
            const addTo = res.get(move.to) || []
            addTo.push(newMove)
            res.set(move.to, addTo)
        } else {
            const addTo = res.get(move.to) || []
            addTo.push(move)
            res.set(move.to, addTo)
        }
    }

    return Array.from(res.values()).flatMap(x => x)
}

export function splitMove<Index>(move: Move<Index>, diceUsed: number[], player: Color, rules: Rules<Index, unknown>) {
    const res = []

    let from = move.from
    for (const dice of diceUsed) {
        const to = rules.movedBy(from, dice, player)
        res.push({
            from: from,
            to: to
        })
        from = to
    }
    console.assert(from === move.to)
    return res
}