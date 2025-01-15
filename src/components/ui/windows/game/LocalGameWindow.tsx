import {RuleSet} from "../../../../game/game_rule/RuleSet.ts";
import {localGameControllerFactory} from "../../../../game/game_controller/local/factory.ts";
import {useFullGameContext} from "../../../../game/GameContext.ts";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "../../../game/control_panel/ControlPanel.tsx";
import {GameController} from "../../../../game/game_controller/GameController.ts";
import {GameContextHolder} from "../../../game/GameContextHolder.tsx";

interface LocalGameWindowProps<Index, Prop> {
    ruleset: RuleSet<Index, Prop>
}

const InnerLocalGameWindow = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => {
    const gameContext = useFullGameContext()

    const gameController: GameController = localGameControllerFactory(
        {
            gameContext: gameContext,
            ruleSet: ruleset
        }
    )

    return (
        <GameAndControlPanelContainer>
            <GameView gameController={gameController} />
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}

export const LocalGameWindow = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => (
    <GameContextHolder>
        <InnerLocalGameWindow ruleset={ruleset} />
    </GameContextHolder>
)