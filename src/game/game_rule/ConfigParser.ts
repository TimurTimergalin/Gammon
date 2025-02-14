import {Color} from "../../common/color";
import {DiceStatus} from "../dice_state/DiceStatus";
import {Board} from "../board/Board";
import {PlayerState} from "../player_info/PlayerState";
import {FetchType} from "../../common/requests";

export interface Config<Index, Prop> {
    placement: Board<Index, Prop>,
    player: Color,  // Цвет игрока, который ходит
    dice: [DiceStatus | null, DiceStatus | null],
    userPlayer: Color  // Цвет пользователя,
    points: {
        white: number,
        black: number,
        total: number
    },
    players: {
        white: PlayerState,
        black: PlayerState
    }
}

export interface ConfigParser<RemoteConfig, Index, Prop> {
    mapConfig(config: RemoteConfig): Config<Index, Prop>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preprocessConfig(fetch: FetchType, raw: any): Promise<RemoteConfig>
}