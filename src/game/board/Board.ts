import {Color} from "../color.ts";

export interface Board<Index, Prop> {
    get(i: Index): Prop

    put(i: Index, color: Color): void

    remove(i: Index): Color

    [Symbol.iterator](): Iterator<[Index, Prop]>

    move(from: Index, to: Index): void
}
