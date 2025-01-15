import {Color} from "../color.ts";
import {LayerStatus} from "../../components/game/dice_layer/LayerStatus.ts";

export interface DiceStatus {
    value: number,
    color: Color,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus
}