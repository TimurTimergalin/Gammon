import {RuleSet} from "../../game/game_rule/RuleSet";
import {useFullGameContext} from "../../game/GameContext";
import {localGameInit} from "../../game/game_controller/local/factory";
import {GameAndControlPanelContainer} from "../../components/game_page/GameAndControlPanelContainer";
import GameView from "../../components/game/GameView";
import {ControlPanel} from "../../components/game/control_panel/ControlPanel";
import {GameContextHolder} from "../../components/game/GameContextHolder";
import {GamePart} from "../../parts/GamePart";
import {backgammonRuleSet} from "../../game/game_rule/backgammon/RuleSet";

interface LocalGameWindowProps<Index, Prop> {
    ruleset: RuleSet<Index, Prop>
}

const InnerLocalGamePage = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => {
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

export const LocalGamePage = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => (
    <GameContextHolder>
        <InnerLocalGamePage ruleset={ruleset}/>
    </GameContextHolder>
)

export default function BackgammonLocalGamePage() {
    return <LocalGamePage ruleset={backgammonRuleSet}/>;
}