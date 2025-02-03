import {RuleSet} from "../../game/game_rule/RuleSet";
import {useFullGameContext} from "../../game/GameContext";
import {localGameInit} from "../../game/game_controller/local/factory";
import {GameAndControlPanelContainer} from "../../components/game_page/GameAndControlPanelContainer";
import {ControlPanel} from "../../components/game/control_panel/ControlPanel";
import {GameContextHolder} from "../../components/game/GameContextHolder";
import {GamePart} from "../../components/game_page/GamePart";
import {backgammonRuleSet} from "../../game/game_rule/backgammon/RuleSet";
import GameView from "../../components/game/GameView";
import {EndWindow} from "../../components/game/end_window/EndWindow";
import {EndWindowContent} from "./_deps/EndWindowContent";

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
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                <GamePart displayButtons={true}>
                    <GameView gameController={controller} labelMapper={labelMapper}/>
                </GamePart>
                <EndWindow>
                    <EndWindowContent />
                </EndWindow>
            </div>
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