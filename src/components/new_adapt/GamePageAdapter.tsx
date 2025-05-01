import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import {GamePageLayoutState} from "../../controller/new_adapt/game_page/layout_state";
import {useWindowSize} from "../../common/hooks";
import {gamePageLayoutTree, getGamePageLayout} from "../../controller/new_adapt/game_page/layout_calculator";

const GamePageLayoutContext = createContext<GamePageLayoutState | null>(null)

export const GamePageAdapter = ({children}: {children?: ReactNode | ReactNode[]}) => {
    const {width, height} = useWindowSize()
    const layoutState = useRef(new GamePageLayoutState())

    useEffect(() => {
        layoutState.current.layout = getGamePageLayout(gamePageLayoutTree, width, height)
    }, [height, width])

    return (
        <GamePageLayoutContext.Provider value={layoutState.current}>{children}</GamePageLayoutContext.Provider>
    )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useGamePageLayout = () => useContext(GamePageLayoutContext)
