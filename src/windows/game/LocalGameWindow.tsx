import {RuleSet} from "../../game/game_rule/RuleSet.ts";
import {useFullGameContext} from "../../game/GameContext.ts";
import {localGameInit} from "../../game/game_controller/local/factory.ts";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../components/game/GameView.tsx";
import {ControlPanel} from "../../components/game/control_panel/ControlPanel.tsx";
import {GameContextHolder} from "../../components/game/GameContextHolder.tsx";

interface LocalGameWindowProps<Index, Prop> {
    ruleset: RuleSet<Index, Prop>
}

const InnerLocalGameWindow = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => {
    const gameContext = useFullGameContext()

    const {controller, labelMapper} = localGameInit(
        {
            gameContext: gameContext,
            ruleSet: ruleset
        }
    )

    return (
        <GameAndControlPanelContainer>
            <GameView gameController={controller} labelMapper={labelMapper}/>
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}

export const LocalGameWindow = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => (
    <GameContextHolder>
        <InnerLocalGameWindow ruleset={ruleset}/>
    </GameContextHolder>
)