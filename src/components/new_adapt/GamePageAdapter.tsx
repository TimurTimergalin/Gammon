import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import {GamePageLayoutState, GamePageSideBarLayoutState} from "../../controller/new_adapt/game_page/layout_state";
import {useWindowSize} from "../../common/hooks";
import {gamePageLayoutTree, getGamePageLayout} from "../../controller/new_adapt/game_page/layout_calculator";
import {SideBarLayoutContextProvider} from "./SideBarContext";

const GamePageLayoutContext = createContext<GamePageLayoutState | null>(null)

export const GamePageAdapter = ({children}: {children?: ReactNode | ReactNode[]}) => {
    const {width, height} = useWindowSize()
    const layoutState = useRef(new GamePageLayoutState())
    const sideBarLayoutState = useRef(new GamePageSideBarLayoutState(layoutState.current))

    useEffect(() => {
        layoutState.current.layout = getGamePageLayout(gamePageLayoutTree, width, height)
    }, [height, width])

    return (
        <GamePageLayoutContext.Provider value={layoutState.current}>
            <SideBarLayoutContextProvider value={sideBarLayoutState.current}>
                {children}
            </SideBarLayoutContextProvider>
        </GamePageLayoutContext.Provider>
    )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useGamePageLayout = () => useContext(GamePageLayoutContext)
