import {Color} from "../color.ts";
import {LayerStatus} from "../../components/game/dice_layer/LayerStatus.ts";

export interface DiceState {
    value: number,
    color: Color,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus
}