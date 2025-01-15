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
        const res: Map<T, Move<T>> = new Map()

        for (const move of moves) {
            if (res.has(move.from)) {
                const oldMove = res.get(move.from)!
                res.delete(move.from)
                const newMove: Move<T> = {from: oldMove.from, to: move.to}
                res.set(move.to, newMove)
            } else {
                res.set(move.to, move)
            }
        }

        return Array.from(res.values())
    }