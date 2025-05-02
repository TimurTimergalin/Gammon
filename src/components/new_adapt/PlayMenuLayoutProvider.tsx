import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import {PlayMenuLayoutState} from "../../controller/new_adapt/menu/play/layout_state";
import {useWindowSize} from "../../common/hooks";
import {observer} from "mobx-react-lite";
import {useSideBarLayout} from "./SideBarContext";
import {getSideBarSpaceTaken} from "../../controller/new_adapt/side_bar/layout_modes";
import {getPlayMenuBoardLayoutMode} from "../../controller/new_adapt/menu/play/layout_calculator";

const PlayMenuLayoutContext = createContext<PlayMenuLayoutState | null>(null)

export const PlayMenuLayoutProvider = observer(({children}: {children?: ReactNode | ReactNode[]}) => {
    const {width} = useWindowSize()
    const sideBarLayout = useSideBarLayout().mode
    const availableWidth = width - getSideBarSpaceTaken(sideBarLayout).width
    const layoutState = useRef(new PlayMenuLayoutState())

    useEffect(() => {
        layoutState.current.mode = getPlayMenuBoardLayoutMode(availableWidth)
    }, [availableWidth]);

    return (
        <PlayMenuLayoutContext.Provider value={layoutState.current}>
            {children}
        </PlayMenuLayoutContext.Provider>
    )
} )

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayMenuLayout = () => useContext(PlayMenuLayoutContext)!
