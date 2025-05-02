import {RuleSet} from "../../../../game/game_rule/RuleSet";
import {useFullGameContext} from "../../../../game/GameContext";
import {useSearchParams} from "react-router";
import {useEffect} from "react";
import {localGameInit} from "../../../../game/game_controller/local/factory";
import {GamePage} from "../../../../components/game_page/GamePage";
import GameView from "../../../../components/game/GameView";
import {LocalPlayEndWindowContent} from "./LocalPlayEndWindowContent";
import {EndWindow} from "../../../../components/game/end_window/EndWindow";
import {GameContextHolder} from "../../../../components/game/GameContextHolder";

type LocalGamePageProps<Index, Prop> = { ruleset: RuleSet<Index, Prop> };
const InnerLocalGamePage = <Index, Prop>({ruleset}: LocalGamePageProps<Index, Prop>) => {
    const gameContext = useFullGameContext()
    const [searchParams] = useSearchParams([["pointsUntil", "1"], ["blitz", "0"]])

    const pointsUntilParsed = parseInt(searchParams.get("pointsUntil") || "1")
    const pointsUntil = !isNaN(pointsUntilParsed) && pointsUntilParsed >= 1 ? pointsUntilParsed : 1

    const blitzParsed = parseInt(searchParams.get("blitz") || "0")
    const blitz = !isNaN(blitzParsed) && blitzParsed === 1

    useEffect(() => {
        localGameInit(
            {
                gameContext: gameContext,
                ruleSet: ruleset,
                pointsUntil: pointsUntil,
                blitz: blitz
            }
        )
    }, [blitz, gameContext, pointsUntil, ruleset])

    useEffect(() => {
        gameContext.playersInfo.player1 = {
            username: "Белые",
            iconSrc: "/user_icon_placeholder.svg"
        }
        gameContext.playersInfo.player2 = {
            username: "Черные",
            iconSrc: "/user_icon_placeholder.svg"
        }
    }, [gameContext])

    return (
        <GamePage displayTimer={true} displayControls={true}>
            <GameView />
            <EndWindow>
                <LocalPlayEndWindowContent />
            </EndWindow>
        </GamePage>
    )
}

export const LocalGamePage = <Index, Prop>(props: LocalGamePageProps<Index, Prop>) => (
    <GameContextHolder>
        <InnerLocalGamePage {...props} />
    </GameContextHolder>
)