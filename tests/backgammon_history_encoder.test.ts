import {BackgammonIndex} from "../src/game/board/backgammon/types";
import {Move} from "../src/game/board/move";
import {Color} from "../src/common/color";
import {BackgammonHistoryEncoder} from "../src/game/game_rule/backgammon/HistoryEncoder";

test("encode:no repeat", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 17, to: 13},
        {from: 20, to: 19}
    ]
    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(2)
    expect(encoded).toContain("17/13")
    expect(encoded).toContain("20/19")
})

test("encode:no repeat black", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 13, to: 17},
        {from: 5, to: 8}
    ]
    const player = Color.BLACK
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(2)
    expect(encoded).toContain("12/8")
    expect(encoded).toContain("20/17")
})

test("encode:repeat", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 17, to: 13},
        {from: 17, to: 13}
    ]
    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(1)
    expect(encoded).toContain("17/13 (2)")
})

test("encode:with store", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 4, to: "White Store"}
    ]
    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(1)
    expect(encoded).toContain("4/off")
})

test("encode:from bar", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: "White Bar", to: 20}
    ]
    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(1)
    expect(encoded).toContain("bar/20")
})

test("encode:to bar", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 20, to: 15},
        {from: 15, to: "Black Bar" }
    ]
    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(1)
    expect(encoded).toContain("20/15*")
})

test("encode:sequence", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 20, to: 15},
        {from: 15, to: 9}
    ]
    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(1)
    expect(encoded).toContain("20/15/9")
})

test("encode:2 sequences", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 20, to: 15},
        {from: 15, to: 10},
        {from: 12, to: 7},
        {from: 7, to: 2}
    ]

    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(2)
    expect(encoded).toContain("20/15/10")
    expect(encoded).toContain("12/7/2")
})

test("encode:extreme", () => {
    const moves: Move<BackgammonIndex>[] = [
        {from: 8, to: 4},
        {from: 4, to: "Black Bar"},
        {from: 4, to: "White Store"},
        {from: 8, to: 4},
        {from: 4, to: "White Store"}
    ]

    const player = Color.WHITE
    const encoded = new BackgammonHistoryEncoder().encode(moves, player)
    expect(encoded.length).toEqual(1)
    expect(encoded).toContain("8/4*/off (2)")
})
