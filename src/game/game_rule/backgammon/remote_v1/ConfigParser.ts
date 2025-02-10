
import {Color} from "../../../../common/color";
import {DiceStatus} from "../../../dice_state/DiceStatus";
import {LayerStatus} from "../../../../components/game/dice_layer/LayerStatus";
import {Config, ConfigParser} from "../../ConfigParser";
import {BackgammonRemoteConfig} from "./types";
import {BackgammonIndex, BackgammonProp} from "../../../board/backgammon/types";
import {BackgammonBoard} from "../../../board/backgammon/BackgammonBoard";
import {logger} from "../../../../logging/main";

const console = logger("game/game_rule/backgammon/remote_v1")

export class BackgammonConfigParser implements ConfigParser<BackgammonRemoteConfig, BackgammonIndex, BackgammonProp> {
    mapConfig({gameData, blackPoints, whitePoints}: BackgammonRemoteConfig): Config<BackgammonIndex, BackgammonProp> {
        const config = gameData
        const toColor = (name: "WHITE" | "BLACK") => name === "WHITE" ? Color.WHITE : Color.BLACK
        const player = toColor(config.turn)
        const userPlayer = toColor(config.color)
        const placement: Map<BackgammonIndex, BackgammonProp> = new Map()

        placement.set("White Bar", {color: Color.WHITE, quantity: config.bar.WHITE})
        placement.set("Black Bar", {color: Color.BLACK, quantity: config.bar.BLACK})

        const toIndex = (ri: number): BackgammonIndex => ri === 0 ? "White Store" : ri === 25 ? "Black Store" : ri
        for (const {color, count, id} of config.deck) {
            console.assert(0 <= id)
            console.assert(id <= 25)
            console.assert(count > 0)
            placement.set(toIndex(id), {color: toColor(color), quantity: count})
        }

        const dice: [DiceStatus, DiceStatus] = [
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

        return {
            placement: new BackgammonBoard(placement),
            player: player,
            dice: dice,
            userPlayer: userPlayer,
            points: {
                white: whitePoints,
                black: blackPoints
            }
        }
    }
}