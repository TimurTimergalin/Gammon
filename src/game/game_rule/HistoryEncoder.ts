import {Move} from "../board/move";
import {Color} from "../../common/color";

export interface HistoryEncoder<Index> {
    encode(moves: Move<Index>[], player: Color): string[]
}