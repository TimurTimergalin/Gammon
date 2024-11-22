import {CSSProperties, ReactNode, useState} from "react";
import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../../adapt/ScreenSpecs.ts";
import {PlayButton} from "./PlayButton.tsx";


const defaultColor = "#ffffff"
const unfocusedColor = "#bbbbbb"

const borderRadius = (scaleFactor: number) => 20 * scaleFactor

const OptionTab = observer(function OptionTab({chosen, position, callback, name}: {
    chosen: boolean,
    position: ("Left" | "Right")[],
    callback: () => void,
    name: string
}) {
    const screenSpecs = useScreenSpecs()


    const style: CSSProperties = {
        flex: 1,
        borderTopLeftRadius: position.includes("Left") ? borderRadius(screenSpecs.scaleFactor) : 0,
        borderTopRightRadius: position.includes("Right") ? borderRadius(screenSpecs.scaleFactor) : 0,
        backgroundColor: chosen ? defaultColor : unfocusedColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    return <div style={style} onClick={callback}>{name}</div>
})

export const ControlPanel = observer(function ControlPanel({options}: {
    options: Map<string, undefined | (() => ReactNode)>
}) {
    const screenSpecs = useScreenSpecs()
    const optionPanelHeight = 100 * screenSpecs.scaleFactor

    let firstOption: string | undefined = undefined
    for (const [name, display] of options.entries()) {
        if (display !== undefined) {
            firstOption = name
            break
        }
    }
    console.assert(firstOption !== undefined)
    firstOption = firstOption!

    const [chosenOption, setChosenOption] = useState(firstOption)

    const tabs = []
    let i = 0
    const n = options.size

    for (const [name, display] of options.entries()) {
        const position: ("Left" | "Right")[] = []
        if (i === 0) {
            position.push("Left")
        }
        if (i === n - 1) {
            position.push("Right")
        }

        const callback = (display !== undefined && name !== chosenOption) ? (() => setChosenOption(name)) : () => {
        }
        tabs.push(
            <OptionTab chosen={name === chosenOption} position={position} callback={callback} name={name} key={name}/>
        )
        ++i
    }

    const TabPage = options.get(chosenOption)!

    return (
        <div style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            borderRadius: borderRadius(screenSpecs.scaleFactor),
            backgroundColor: defaultColor,
            userSelect: "none"
        }}>
            <div style={{
                height: `${optionPanelHeight}px`,
                width: "100%",
                display: "flex",
                flexDirection: "row"
            }}>
                {tabs}
            </div>
            <div style={{
                flex: 1,
                width: "100%"
            }}>
                <TabPage/>
            </div>
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
            }}>
                <PlayButton callback={() => {}} />
            </div>
        </div>
    )
})