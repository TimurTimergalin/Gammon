import {Color, oppositeColor} from "../../../../common/color";
import {DiceStatus} from "../../../dice_state/DiceStatus";
import {LayerStatus} from "../../../../components/game/dice_layer/LayerStatus";
import {Config, ConfigParser, DoubleCubeConfig} from "../../ConfigParser";
import {BackgammonRemoteConfig, BackgammonRemotePlayer} from "./types";
import {BackgammonIndex, BackgammonProp} from "../../../board/backgammon/types";
import {BackgammonBoard} from "../../../board/backgammon/BackgammonBoard";
import {logger} from "../../../../logging/main";
import {imageUri} from "../../../../requests/paths";
import {usernames} from "../../../../requests/requests";
import {FetchType} from "../../../../common/requests";

const console = logger("game/game_rule/backgammon/remote_v1")

export class BackgammonConfigParser implements ConfigParser<BackgammonRemoteConfig, BackgammonIndex, BackgammonProp> {
    mapConfig({gameData, blackPoints, whitePoints, threshold, players, doubleCubePosition, doubleCubeValue, winner}: BackgammonRemoteConfig): Config<BackgammonIndex, BackgammonProp> {
        const config = gameData
        const toColor = (name: "WHITE" | "BLACK") => name === "WHITE" ? Color.WHITE : Color.BLACK
        const player = doubleCubePosition === "OFFERED_TO_WHITE" || doubleCubePosition === "OFFERED_TO_BLACK" ?
            oppositeColor(toColor(config.turn)) :
            toColor(config.turn)
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

        const dice: [DiceStatus | null, DiceStatus | null] = [
            config.zar[0] ? {
                value: config.zar[0],
                color: config.first ? Color.WHITE : toColor(config.turn),
                usageStatus: LayerStatus.NONE,
                unavailabilityStatus: LayerStatus.NONE
            } : null,
            config.zar[1] ? {
                value: config.zar[1],
                color: config.first ? Color.BLACK : toColor(config.turn),
                usageStatus: LayerStatus.NONE,
                unavailabilityStatus: LayerStatus.NONE
            } : null
        ]

        const doubleCube: DoubleCubeConfig = doubleCubePosition === "UNAVAILABLE" ? {
            state: "unavailable"
        } : doubleCubePosition === "FREE" ? {
            state: "free"
        } : doubleCubePosition === "BELONGS_TO_WHITE" ? {
            state: "belongs_to_white",
            value: doubleCubeValue!
        } : doubleCubePosition === "BELONGS_TO_BLACK" ? {
            state: "belongs_to_black",
            value: doubleCubeValue!
        } : doubleCubePosition === "OFFERED_TO_WHITE" ? {
            state: "offered_to_white",
            value: doubleCubeValue!
        } : {
            state: "offered_to_black",
            value: doubleCubeValue!
        }

        return {
            placement: new BackgammonBoard(placement),
            player: player,
            dice: dice,
            userPlayer: userPlayer,
            points: {
                white: whitePoints,
                black: blackPoints,
                total: threshold
            },
            players: {
                white: {
                    username: players.WHITE.username,
                    iconSrc: imageUri(players.WHITE.id)
                },
                black: {
                    username: players.BLACK.username,
                    iconSrc: imageUri(players.BLACK.id)
                }
            },
            doubleCube: doubleCube,
            winner: winner === "WHITE" ? Color.WHITE : winner === "BLACK" ? Color.BLACK : winner
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async preprocessConfig(fetch: FetchType, raw: any): Promise<BackgammonRemoteConfig> {
        const resp = await usernames(fetch, [raw.players.WHITE, raw.players.BLACK])
        if (!resp.ok) {
            throw new Error(String(resp))
        }
        const _usernames = await resp.json() as string[]

        raw.players.WHITE = {
            id: raw.players.WHITE,
            username: _usernames[0]
        } satisfies BackgammonRemotePlayer

        raw.players.BLACK = {
            id: raw.players.BLACK,
            username: _usernames[1]
        } satisfies BackgammonRemotePlayer

        return raw
    }
}