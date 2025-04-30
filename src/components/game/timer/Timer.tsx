import {colorFill, oppositeColor} from "../../../common/color";
import {useGameContext} from "../../../game/GameContext";
import {CSSProperties} from "react";
import {observer} from "mobx-react-lite";

export const Timer = observer(({index}: { index: 0 | 1 }) => {
    const timerState = useGameContext("timerPairState")[index === 0 ? "timer1" : "timer2"]
    const color = timerState.owner

    const minutes = Math.floor(timerState.timeMs / (1000 * 60))
    const seconds = Math.floor((timerState.timeMs - 1000 * 60 * minutes) / 1000)

    let timerText = minutes + ":" + (seconds >= 10 ? seconds : "0" + seconds)
    if (timerState.timeMs <= 20 * 1000) {
        const centiseconds = Math.floor((timerState.timeMs - minutes * 1000 * 60 - seconds * 1000) / 10)
        timerText += "." + centiseconds
    }

    const bgColor = colorFill(color)
    const textColor = colorFill(oppositeColor(color))

    const containerStyle: CSSProperties = {
        position: "relative",
        height: 50,
        width: "fit-content"
    }

    const timerStyle: CSSProperties = {
        backgroundColor: bgColor,
        color: textColor,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        height: "100%",
        fontSize: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        textAlign: "center"
    }

    const barrierStyle: CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: 5,
        backgroundColor: "#66666666"
    }

    return (
        <div style={containerStyle}>
            <div style={timerStyle}>{timerText}</div>
            {!timerState.active &&
                <div style={barrierStyle}></div>
            }
        </div>
    )
})