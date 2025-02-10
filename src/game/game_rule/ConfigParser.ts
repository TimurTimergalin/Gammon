import {Color} from "../../common/color";
import {DiceStatus} from "../dice_state/DiceStatus";
import {Board} from "../board/Board";

export interface Config<Index, Prop> {
    placement: Board<Index, Prop>,
    player: Color,  // Цвет игрока, который ходит
    dice: [DiceStatus, DiceStatus],
    userPlayer: Color  // Цвет пользователя,
    points: {
        white: number,
        black: number
    }
}

export interface ConfigParser<RemoteConfig, Index, Prop> {
    mapConfig(config: RemoteConfig): Config<Index, Prop>
}