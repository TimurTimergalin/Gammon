import {Board} from "../board/Board.ts";

export type InitPlacement<Index, Prop> = () => Board<Index, Prop>