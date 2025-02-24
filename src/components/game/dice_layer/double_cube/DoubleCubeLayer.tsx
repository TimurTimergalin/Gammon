import {DoubleCube} from "./DoubleCube";
import {boardHeight, boardWidth} from "../../dimensions/board_size_constants";

export const DoubleCubeLayer = () => {
    return <DoubleCube value={64} cx={boardWidth / 2} cy={boardHeight / 2} rotation={0}/>
}