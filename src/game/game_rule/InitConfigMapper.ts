import {Color} from "../color.ts";
import {DiceState} from "../game_state/DiceState.ts";

export interface Config<PositionIndexType, PositionPropType> {
        placement: Map<PositionIndexType, PositionPropType>,
        player: Color,
        dice: [DiceState, DiceState],
        active: boolean
    }
export interface InitConfigMapper<RemoteConfigType, PositionIndexType, PositionPropType> {
    mapConfig(config: RemoteConfigType): Config<PositionIndexType, PositionPropType>
}