import {Color} from "../../../../common/color";
import {DiceStatus, makeDice} from "../../../dice_state/DiceStatus";
import {Config, ConfigParser} from "../../ConfigParser";
import {BackgammonRemoteConfig} from "./types";
import {BackgammonIndex, BackgammonProp} from "../../../board/backgammon/types";
import {BackgammonBoard} from "../../../board/backgammon/BackgammonBoard";
import {logger} from "../../../../logging/main";
import {imageUri} from "../../../../requests/paths";
import {FetchType} from "../../../../common/requests";
import {
    inferTurnFromCubePosition,
    mapRemoteColor,
    mapRemoteDoubleCube,
    requestPlayers
} from "../../common_remote/common";

const console = logger("game/game_rule/backgammon/remote_v1")

export class BackgammonConfigParser implements ConfigParser<BackgammonRemoteConfig, BackgammonIndex, BackgammonProp> {
    mapConfig({
                  gameData,
                  blackPoints,
                  whitePoints,
                  threshold,
                  players,
                  doubleCubePosition,
                  doubleCubeValue,
                  winner
              }: BackgammonRemoteConfig): Config<BackgammonIndex, BackgammonProp> {
        const config = gameData
        const player = inferTurnFromCubePosition(doubleCubePosition, config.turn)
        const userPlayer = mapRemoteColor(config.color)
        const placement: Map<BackgammonIndex, BackgammonProp> = new Map()

        placement.set("White Bar", {color: Color.WHITE, quantity: config.bar.WHITE})
        placement.set("Black Bar", {color: Color.BLACK, quantity: config.bar.BLACK})

        const toIndex = (ri: number): BackgammonIndex => ri === 0 ? "White Store" : ri === 25 ? "Black Store" : ri
        for (const {color, count, id} of config.deck) {
            console.assert(0 <= id)
            console.assert(id <= 25)
            console.assert(count > 0)
            placement.set(toIndex(id), {color: mapRemoteColor(color), quantity: count})
        }

        const dice: [DiceStatus | null, DiceStatus | null] = [
            config.zar[0] ? makeDice(
                config.zar[0],
                config.first ? Color.WHITE : mapRemoteColor(config.turn)
            ) : null,
            config.zar[1] ? makeDice(
                config.zar[1],
                config.first ? Color.BLACK : mapRemoteColor(config.turn),
            ) : null
        ]

        const doubleCube = mapRemoteDoubleCube(doubleCubePosition, doubleCubeValue)

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
            winner: winner == null ? null : mapRemoteColor(winner)
        }
    }

    async preprocessConfig(fetch: FetchType, raw: ReturnType<JSON['parse']>): Promise<BackgammonRemoteConfig> {
        await requestPlayers(fetch, raw)

        return raw
    }
}