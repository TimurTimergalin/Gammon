import {Color} from "../../common/color";
import {DiceStatus} from "../dice_state/DiceStatus";
import {Board} from "../board/Board";
import {PlayerState} from "../player_info/PlayerState";
import {FetchType} from "../../common/requests";

export type DoubleCubeConfig = {
        state: "free" | "unavailable",
        value?: undefined
    } | {
        state: "belongs_to_white" | "belongs_to_black" | "offered_to_white" | "offered_to_black",
        value: number
    }

export interface Config<Index, Prop> {
    placement: Board<Index, Prop>,
    player: Color,  // Цвет игрока, который ходит
    dice: [DiceStatus | null, DiceStatus | null],
    userPlayer: Color | null  // Цвет пользователя,
    points: {
        white: number,
        black: number,
        total: number
    },
    players: {
        white: PlayerState,
        black: PlayerState
    },
    doubleCube: DoubleCubeConfig,
    winner: Color | null
}

export interface ConfigParser<RemoteConfig, Index, Prop> {
    mapConfig(config: RemoteConfig): Config<Index, Prop>
    preprocessConfig(fetch: FetchType, raw: ReturnType<JSON['parse']>): Promise<RemoteConfig>
}