import {observer} from "mobx-react-lite";
import {CSSProperties, ReactNode} from "react";
import {useGameContext} from "../../game/GameContext";
import {useWindowSize} from "../../common/hooks";
import {boardHeight, boardWidth} from "../game/dimensions/board_size_constants";
import {PlayerIcon} from "../game/players/PlayerIcon";
import {ColumnTimer, MicroTimer, NormalTimer} from "../game/timer/Timer";
import {ButtonPanel} from "../game/buttons/ButtonPanel";
import {SideBar} from "../sidebar/SideBar";
import {ControlPanel} from "../game/control_panel/ControlPanel";
import {useGamePageLayout} from "../adapt/GamePageLayoutProvider";
import {getHeightTaken, getWidthTaken} from "../../controller/adapt/game_page/layout_calculator/common";
import {getControlsSpaceTaken} from "../../controller/adapt/game_page/layout_modes";

export const GamePage = observer(function GamePage({displayTimer = false, displayControls = false, children}: {
    displayTimer?: boolean,
    displayControls?: boolean,
    children: [
        ReactNode,  // Игра
        ReactNode  // Окно конца игры
    ]
}) {
    const layout = useGamePageLayout().layout
    const [sideBarLayout, historyLayout, controlsLayout] = layout
    const {player1, player2} = useGameContext("playersInfo")

    const {width, height} = useWindowSize()
    const boardAspectRatio = boardWidth / boardHeight
    const availableWidth = width - getWidthTaken(layout)
    const availableHeight = height - getHeightTaken(layout)

    const gameContainerStyle =
        availableHeight * boardAspectRatio <= availableWidth ? {
            height: availableHeight,
            width: boardAspectRatio * availableHeight
        } : {
            height: availableWidth / boardAspectRatio,
            width: availableWidth
        } satisfies CSSProperties

    const layer1Style: CSSProperties = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: sideBarLayout === "Collapsed" ? "column" : "row",
        alignItems: "center"
    }

    const layer2Style: CSSProperties = {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        marginTop: sideBarLayout === "Collapsed" ? 0 : 10,
        display: "flex",
        flexDirection: historyLayout === "Down" ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        minHeight: 0
    }

    const historyContainerStyle: CSSProperties =
        historyLayout === "Normal" ? {
            width: 290,
            marginLeft: 10,
            height: 400,
            display: "flex",
            maxHeight: "80vh"
        } : historyLayout === "Down" ? {
            marginLeft: "10%",
            marginRight: "10%",
            height: "fit-content",
            width: gameContainerStyle.width + getControlsSpaceTaken(controlsLayout).width,
            marginTop: 10
        } : {
            width: 80,
            height: "fit-content",
            marginLeft: 10,
            display: "flex"
        }

    let gamePart: ReactNode
    if (controlsLayout === "Normal") {
        const layer3Style: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        }

        const timerContainerStyle: CSSProperties = {
            position: "absolute",
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            width: "fit-content"
        }

        gamePart = (
            <div style={layer3Style}>
                <div style={{position: "relative", display: "flex", marginBottom: 6, width: "100%"}}>
                    <PlayerIcon {...player2} />
                    {displayTimer &&
                        <div style={timerContainerStyle}>
                            <NormalTimer index={0}/>
                        </div>
                    }
                </div>
                <div style={gameContainerStyle}>
                    {children}
                </div>
                <div style={{position: "relative", display: "flex", width: "100%", marginTop: 6}}>
                    <PlayerIcon {...player1} />
                    <div style={{flex: 1}}>
                    </div>
                    {displayTimer &&
                        <div style={timerContainerStyle}>
                            <NormalTimer index={1}/>
                        </div>
                    }
                    {displayControls &&
                        <ButtonPanel/>
                    }
                </div>
            </div>
        )
    } else if (controlsLayout === "Micro") {
        const layer3Style: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        }

        gamePart = (
            <div style={layer3Style}>
                <div style={{display: "flex", marginBottom: 6, width: "100%"}}>
                    {displayTimer && <MicroTimer index={0}/>}
                </div>
                <div style={gameContainerStyle}>
                    {children}
                </div>
                <div style={{display: "flex", marginTop: 6, width: "100%"}}>
                    {displayTimer && <MicroTimer index={1}/>}
                    <div style={{flex: 1}}/>
                    {displayControls && <div style={{display: "flex"}}>
                        <ButtonPanel/>
                    </div>}
                </div>
            </div>
        )
    } else {
        const layer3Style: CSSProperties = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "stretch",
            position: "relative", height: "fit-content"
        }

        const buttonsContainerStyle: CSSProperties = {
            position: "absolute",
            top: 0,
            bottom: 0,
            marginTop: "auto",
            marginBottom: "auto",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            scale: controlsLayout === "Right" ? "1" : "0.8"
        }

        gamePart = (
            <div style={layer3Style}>
                <div style={gameContainerStyle}>
                    {children}
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    alignItems: "center",
                    minHeight: "100%",
                    marginLeft: 10
                }}>
                    {controlsLayout === "Right" &&
                        <>
                            <PlayerIcon iconSrc={player2.iconSrc}/>
                            {displayTimer && <ColumnTimer index={0}/>}
                        </>
                    }
                    {controlsLayout === "MicroRight" &&
                        <MicroTimer index={0}/>
                    }
                    <div style={{flex: 1}}/>
                    {controlsLayout === "Right" &&
                        <>
                            {displayTimer && <ColumnTimer index={1}/>}
                            <PlayerIcon iconSrc={player1.iconSrc}/>
                        </>
                    }
                    {controlsLayout === "MicroRight" &&
                        <MicroTimer index={1}/>
                    }
                    {displayControls && <div style={buttonsContainerStyle}>
                        <ButtonPanel/>
                    </div>}
                </div>
            </div>
        )
    }

    return (
        <div style={layer1Style}>
            <SideBar/>
            <div style={layer2Style}>
                {gamePart}
                <div style={historyContainerStyle}>
                    <ControlPanel/>
                </div>
            </div>
        </div>
    )
})