import {mergeMoves, Move} from "../src/game/board/move";

test("mergeMoves:repeated destination", () => {
    const moves: Move<number>[] = [
        {from: 23, to: 26},
        {from: 21, to: 23},
        {from: 7, to: 26},
        {from: 3, to: 7}
    ]
    const merged = mergeMoves(moves)

    expect(merged).toHaveLength(4)
    for (const move of merged) {
        expect(moves.includes(move)).toBeTruthy()
    }
})