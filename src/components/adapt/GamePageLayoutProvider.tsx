import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import {GamePageLayoutState, GamePageSideBarLayoutState} from "../../controller/adapt/game_page/layout_state";
import {useWindowSize} from "../../common/hooks";
import {SideBarLayoutContextProvider} from "./SideBarContext";
import {getGamePageLayoutV2} from "../../controller/adapt/game_page/layout_calculator/layout_calculator2";

const GamePageLayoutContext = createContext<GamePageLayoutState | null>(null)

export const GamePageLayoutProvider = ({children}: {children?: ReactNode | ReactNode[]}) => {
    const {width, height} = useWindowSize()
    const layoutState = useRef(new GamePageLayoutState())
    const sideBarLayoutState = useRef(new GamePageSideBarLayoutState(layoutState.current))

    useEffect(() => {
        layoutState.current.layout = getGamePageLayoutV2(width, height)
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
export const useGamePageLayout = () => useContext(GamePageLayoutContext)!
