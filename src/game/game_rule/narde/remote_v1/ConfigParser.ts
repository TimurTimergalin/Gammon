import {Config, ConfigParser} from "../../ConfigParser";
import {NardeRemoteConfig} from "./types";
import {NardeIndex, NardeProp} from "../../../board/narde/types";
import {FetchType} from "../../../../common/requests";
import {mapRemoteColor, mapRemoteDoubleCube, requestPlayers} from "../../common_remote/common";
import {DiceStatus, makeDice} from "../../../dice_state/DiceStatus";
import {NardeRemoteMoveMapper} from "./RemoteMoveMapper";
import {NardeBoard} from "../../../board/narde/NardeBoard";
import {imageUri} from "../../../../requests/paths";

export class NardeConfigParser implements ConfigParser<NardeRemoteConfig, NardeIndex, NardeProp> {
    async preprocessConfig(fetch: FetchType, raw: ReturnType<JSON['parse']>): Promise<NardeRemoteConfig> {
        await requestPlayers(fetch, raw)

        return raw
    }

    mapConfig({
                  gameData,
                  blackPoints,
                  whitePoints,
                  threshold,
                  players,
                  doubleCubePosition,
                  doubleCubeValue,
                  winner,
                  remainWhiteTime,
                  remainBlackTime,
                  increment
              }: NardeRemoteConfig): Config<NardeIndex, NardeProp> {
        const config = gameData
        const player = mapRemoteColor(config.turn)
        const userPlayer = config.color !== null ? mapRemoteColor(config.color) : null
        const dice: [DiceStatus | null, DiceStatus | null] = [
            config.zar[0] ? makeDice(config.zar[0], mapRemoteColor(config.turn)) : null,
            config.zar[1] ? makeDice(config.zar[1], mapRemoteColor(config.turn)) : null
        ]
        const doubleCube = mapRemoteDoubleCube(doubleCubePosition, doubleCubeValue)

        const placement = new Map<NardeIndex, NardeProp>()
        const moveMapper = new NardeRemoteMoveMapper()
        for (const {color, count, id} of config.deck) {
            placement.set(moveMapper.indexFromRemote(id), {color: mapRemoteColor(color), quantity: count})
        }

        return {
            placement: new NardeBoard(placement),
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
            winner: winner == null ? null : mapRemoteColor(winner),
            time: {
                white: remainWhiteTime,
                black: remainBlackTime,
                increment: increment
            }
        }
    }


}