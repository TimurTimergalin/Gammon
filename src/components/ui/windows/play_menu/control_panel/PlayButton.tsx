import {CSSProperties} from "react";
import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../../adapt/ScreenSpecs.ts";
import {AccentedButton} from "../../../../common/AccentedButton.tsx";

export const PlayButton = observer(function PlayButton({callback}: {
    callback: () => void
}) {
    const screenSpecs = useScreenSpecs()
    const scaleMode = screenSpecs.scaleMode

    const fontSizeValue = scaleMode === "Normal" ? 1.3 : scaleMode === "Minimized" ? 0.8 : 0.5


    const verticalMargin = 20 * screenSpecs.scaleFactor

    const style: CSSProperties = {
        flex: 1,
        marginLeft: "15%",
        marginRight: "15%",
        marginTop: verticalMargin,
        marginBottom: verticalMargin,
        fontSize: `${fontSizeValue}em`,
        borderRadius: `5px`
    }

    return <AccentedButton onClick={callback} disabled={false} style={style}>Играть</AccentedButton>
})