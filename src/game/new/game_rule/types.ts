import {Color} from "../../color.ts";
import {BackgammonPositionIndex} from "../../game_rule/backgammon/types.ts";

export type BackgammonPositionProp = undefined | {color: Color, quantity: number}
export type BackgammonPlacement = Map<BackgammonPositionIndex, BackgammonPositionProp>
export type BackgammonMove = {from: BackgammonPositionIndex, to: BackgammonPositionIndex}
export type BackgammonCompoundMove = {primaryMove: BackgammonMove, additionalMoves: BackgammonMove[], dice: number[]}
