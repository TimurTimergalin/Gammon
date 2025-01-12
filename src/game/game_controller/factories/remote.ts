import {GameState} from "../../game_state/GameState.ts";
import {RemoteConnectorImpl} from "../remote/RemoteConnector.ts";
import {BackgammonInitConfigMapper} from "../../game_rule/backgammon/InitConfigMapper.ts";
import {BackgammonRemoteMoveMapper} from "../../game_rule/backgammon/RemoteMoveMapper.ts";
import {RemoteGameController} from "../remote/RemoteGameController.ts";
import {BackgammonRules} from "../../game_rule/backgammon/Rules.ts";
import {BackgammonIndexMapping} from "../../game_rule/backgammon/IndexMapping.ts";
import {BackgammonPropMapping} from "../../game_rule/backgammon/PropMapping.ts";
import {GameController} from "../GameController.ts";

export function getRemoteGameControllerFactory(roomId: number) {
    const remoteConnector = new RemoteConnectorImpl(
        new BackgammonInitConfigMapper(),
        new BackgammonRemoteMoveMapper(),
        roomId
    )
    return async function (gameState: GameState): Promise<GameController> {
        const conf = await remoteConnector.getConfig()
        console.log(conf)

        return new RemoteGameController(
            new BackgammonRules(),
            new BackgammonIndexMapping(conf.player),
            new BackgammonPropMapping(),
            gameState,
            conf.player,
            conf.placement,
            remoteConnector,
            conf.active,
            [[conf.dice[0].color, conf.dice[0].value], [conf.dice[1].color, conf.dice[1].value]]
        )
    }
}