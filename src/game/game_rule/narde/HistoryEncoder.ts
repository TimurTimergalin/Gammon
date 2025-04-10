import {HistoryEncoder} from "../HistoryEncoder";
import {isStore, NardeIndex} from "../../board/narde/types";
import {Move} from "../../board/move";
import {Color} from "../../../common/color";

export class NardeHistoryEncoder implements HistoryEncoder<NardeIndex> {
    private positionOrderKey(i: NardeIndex, player: Color) {
        if (typeof i === "number") {
            if (player === Color.WHITE) {
                return 24 - i
            }
            if (i <= 12) {
                return 12 - i
            }
            return 36 - i
        }
        return 0
    }

    private indexRepr(i: NardeIndex) {
        if (isStore(i)) {
            return "off"
        }
        return i + ""
    }

    private arraysEqual(f: NardeIndex[], s: NardeIndex[]): boolean {
        if (f.length !== s.length) {
            return false
        }

        for (let i = 0; i < f.length; ++i) {
            if (f[i] !== s[i]) {
                return false
            }
        }
        return true
    }

    encode(moves: Move<NardeIndex>[], player: Color): string[] {
        moves.sort(
            (a, b) => this.positionOrderKey(a.from, player) - this.positionOrderKey(b.from, player)
        )

        const sequences: NardeIndex[][] = []
        for (const move of moves) {
            let found = false
            for (const seq of sequences) {
                if (seq[seq.length - 1] === move.from) {
                    seq.push(move.to)
                    found = true
                    break
                }
            }
            if (!found) {
                sequences.push([move.from, move.to])
            }
        }

        const countedSequences: {sequence: NardeIndex[], count: number}[] = []

        for (const seq of sequences) {
            let found = false
            for (const seq1 of countedSequences) {
                if (this.arraysEqual(seq, seq1.sequence)) {
                    ++seq1.count
                    found = true
                    break
                }
            }
            if (!found) {
                countedSequences.push({sequence: seq, count: 1})
            }
        }

        const res: string[] = []

        for (const {sequence, count} of countedSequences) {
            res.push(
                sequence.map(x => this.indexRepr(x)).join("/") + (count > 1 ? `(${count})` : "")
            )
        }

        return res
    }

}