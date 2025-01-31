import {RuleSet} from "../../game/game_rule/RuleSet";
import {useFullGameContext} from "../../game/GameContext";
import {localGameInit} from "../../game/game_controller/local/factory";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer";
import GameView from "../../components/game/GameView";
import {ControlPanel} from "../../components/game/control_panel/ControlPanel";
import {GameContextHolder} from "../../components/game/GameContextHolder";
import {GamePart} from "../../parts/GamePart";

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
            <GamePart displayButtons={true}>
                <GameView gameController={controller} labelMapper={labelMapper}/>
            </GamePart>
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}

export const LocalGameWindow = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => (
    <GameContextHolder>
        <InnerLocalGameWindow ruleset={ruleset}/>
    </GameContextHolder>
)