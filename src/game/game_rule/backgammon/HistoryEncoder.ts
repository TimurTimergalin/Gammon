import {HistoryEncoder} from "../HistoryEncoder";
import {BackgammonIndex, isBar, isStore} from "../../board/backgammon/types";
import {Move} from "../../board/move";
import {Color} from "../../../common/color";
import {forceType} from "../../../common/typing";

export class BackgammonHistoryEncoder implements HistoryEncoder<BackgammonIndex> {
    private moveKey(i: BackgammonIndex) {
        if (typeof i === "number") {
            return i
        }
        if (isBar(i)) {
            return 25
        }
        return 0
    }

    private indexRepr(i: BackgammonIndex, player: Color) {
        if (isBar(i)) {
            return "bar"
        }
        if (isStore(i)) {
            return "off"
        }

        forceType<number>(i)
        return player === Color.WHITE ? i : 25 - i
    }

    private seqItemRepr([i, isBar]: [BackgammonIndex, boolean], player: Color) {
        return this.indexRepr(i, player) + (isBar ? "*" : "")
    }

    encode(moves: Move<BackgammonIndex>[], player: Color): string[] {
        moves.sort((a, b) => {
            const res = this.moveKey(a.from) - this.moveKey(b.from)
            if (player == Color.BLACK) {
                return res
            }
            return -res
        })

        const sequences: [BackgammonIndex, boolean][][] = []
        for (const move of moves) {
            let found = false
            for (const seq of sequences) {
                if (seq[seq.length - 1][0] === move.from) {
                    if (isBar(move.to)) {
                        seq[seq.length - 1] = [seq[seq.length - 1][0], true]
                    } else {
                        seq.push([move.to, false])
                    }
                    found = true
                    break
                }
            }
            if (!found) {
                sequences.push([[move.from, false], [move.to, false]])
            }
        }

        const countedSequences: [[BackgammonIndex, boolean][], number][] = []
        for (const seq of sequences) {
            let found = false
            for (const seq1Count of countedSequences) {
                const [seq1] = seq1Count

                let equal = seq.length == seq1.length
                if (equal) {
                    for (let i = 0; i < seq.length; ++i) {
                        if (seq[i][0] != seq1[i][0]) {
                            equal = false
                            break
                        }
                    }
                }
                if (equal) {
                    seq1Count[1]++
                    found = true
                    break
                }
            }
            if (!found) {
                countedSequences.push([seq, 1])
            }
        }

        const res: string[] = []

        for (const [seq, count] of countedSequences) {
            res.push(
                seq.map((a) => this.seqItemRepr(a, player)).join("/") + (count > 1 ? ` (${count})` : "")
            )
        }


        return res;
    }
}