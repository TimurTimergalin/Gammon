import {CSSProperties} from "react";

export const PlayButton = ({callback}: {
    callback: () => void
}) => {
    const style: CSSProperties = {
        flex: 1,
        marginLeft: "20%",
        marginRight: "20%"
    }

    return <button onClick={callback} style={style}>Играть</button>
}