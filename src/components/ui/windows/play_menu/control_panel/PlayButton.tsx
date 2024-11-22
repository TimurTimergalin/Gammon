import {CSSProperties} from "react";
import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../../adapt/ScreenSpecs.ts";

export const PlayButton = observer(function PlayButton({callback}: {
    callback: () => void
}) {
    const screenSpecs = useScreenSpecs()

    const verticalMargin = 20 * screenSpecs.scaleFactor

    const style: CSSProperties = {
        flex: 1,
        marginLeft: "20%",
        marginRight: "20%",
        marginTop: verticalMargin,
        marginBottom: verticalMargin
    }

    return <button onClick={callback} style={style}>Играть</button>
})