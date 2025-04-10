import {useFullGameContext} from "../../../../game/GameContext";
import {useSearchParams} from "react-router";
import {useEffect, useMemo} from "react";
import {localGameInit} from "../../../../game/game_controller/local/factory";
import {PlayerState} from "../../../../game/player_info/PlayerState";
import {GameAndControlPanelContainer} from "../../../../components/game_page/GameAndControlPanelContainer";
import {GamePart} from "../../../../components/game_page/GamePart";
import GameView from "../../../../components/game/GameView";
import {EndWindow} from "../../../../components/game/end_window/EndWindow";
import {LocalPlayEndWindowContent} from "./LocalPlayEndWindowContent";
import {ControlPanel} from "../../../../components/game/control_panel/ControlPanel";
import {RuleSet} from "../../../../game/game_rule/RuleSet";
import {GameContextHolder} from "../../../../components/game/GameContextHolder";

interface LocalGameWindowProps<Index, Prop> {
    ruleset: RuleSet<Index, Prop>
}

const InnerLocalGamePage = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => {
    const gameContext = useFullGameContext()
    const [searchParams] = useSearchParams([["pointsUntil", "1"]])

    const pointsUntilParsed = parseInt(searchParams.get("pointsUntil") || "1")
    const pointsUntil = !isNaN(pointsUntilParsed) && pointsUntilParsed >= 1 ? pointsUntilParsed : 1

    useEffect(() => {
        localGameInit(
            {
                gameContext: gameContext,
                ruleSet: ruleset,
                pointsUntil: pointsUntil
            }
        )
    }, [gameContext, pointsUntil, ruleset]);

    const player1 = useMemo(() => ({
        username: "Белые",
        iconSrc: "/user_icon_placeholder.svg"
    } satisfies PlayerState), [])

    const player2 = useMemo(() => ({
        username: "Черные",
        iconSrc: "/user_icon_placeholder.svg"
    } satisfies PlayerState), [])

    return (
        <GameAndControlPanelContainer>
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                <GamePart displayButtons={true} player1={player1} player2={player2}>
                    <GameView/>
                </GamePart>
                <EndWindow>
                    <LocalPlayEndWindowContent/>
                </EndWindow>
            </div>
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}
export const LocalGamePage = <Index, Prop>({ruleset}: LocalGameWindowProps<Index, Prop>) => (
    <GameContextHolder>
        <InnerLocalGamePage ruleset={ruleset}
        />
    </GameContextHolder>
)