import {Color} from "../../common/color.ts";
import {DiceStatus} from "../dice_state/DiceStatus.ts";
import {Board} from "../board/Board.ts";

export interface Config<Index, Prop> {
        placement: Board<Index, Prop>,
        player: Color,  // Цвет игрока, который ходит
        dice: [DiceStatus, DiceStatus],
        userPlayer: Color  // Цвет пользователя
    }
export interface ConfigParser<RemoteConfig, Index, Prop> {
    mapConfig(config: RemoteConfig): Config<Index, Prop>
}