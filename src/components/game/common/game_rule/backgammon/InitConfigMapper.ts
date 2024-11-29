import {InitConfigMapper} from "../InitConfigMapper.ts";
import {BackgammonPositionIndex, BackgammonPositionProp, BackgammonRemoteConfig} from "./types.ts";
import {Color} from "../../color.ts";
import {DiceState} from "../../game_state/DiceState.ts";
import {LayerStatus} from "../../../dice_layer/LayerStatus.ts";

export class BackgammonInitConfigMapper implements InitConfigMapper<BackgammonRemoteConfig, BackgammonPositionIndex, BackgammonPositionProp> {
    mapConfig(config: BackgammonRemoteConfig): {
        placement: Map<BackgammonPositionIndex, BackgammonPositionProp>;
        player: Color;
        dice: [DiceState, DiceState];
        active: boolean
    } {
        const toColor = (name: "WHITE" | "BLACK") => name === "WHITE" ? Color.WHITE : Color.BLACK
        const player = toColor(config.color)
        const placement: Map<BackgammonPositionIndex, BackgammonPositionProp> = new Map()

        placement.set("White Bar", config.bar.WHITE === 0 ? null : [Color.WHITE, config.bar.WHITE])
        placement.set("Black Bar", config.bar.BLACK === 0 ? null : [Color.BLACK, config.bar.BLACK])

        const toIndex = (ri: number): BackgammonPositionIndex => ri === 0 ? "White Store" : ri === 25 ? "Black Store" : ri
        for (const {color, count, id} of config.deck) {
            console.assert(0 <= id)
            console.assert(id <= 25)
            console.assert(count > 0)
            placement.set(toIndex(id), [toColor(color), count])
        }

        const dice: [DiceState, DiceState] = [
            {
                value: config.zar[0],
                color: config.first ? Color.WHITE : toColor(config.turn),
                usageStatus: LayerStatus.NONE,
                unavailabilityStatus: LayerStatus.NONE
            },
            {
                value: config.zar[1],
                color: config.first ? Color.BLACK : toColor(config.turn),
                usageStatus: LayerStatus.NONE,
                unavailabilityStatus: LayerStatus.NONE
            }
        ]
        const active = config.color === config.turn

        return {
            placement: placement,
            player: player,
            dice: dice,
            active: active
        }
    }

}