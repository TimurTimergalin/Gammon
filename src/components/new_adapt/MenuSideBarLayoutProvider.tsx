import {observer} from "mobx-react-lite";
import {useWindowSize} from "../../common/hooks";
import {ReactNode, useEffect, useRef} from "react";
import {MenuSidebarLayoutState} from "../../controller/new_adapt/menu/layout_state";
import {getMenuSideBarLayout} from "../../controller/new_adapt/menu/layout_calculator";
import {SideBarLayoutContextProvider} from "./SideBarContext";

export const MenuSideBarLayoutProvider = observer(function MenuSideBarLayoutProvider({children}: {children?: ReactNode | ReactNode[]}) {
    const {width} = useWindowSize()
    const layoutState = useRef(new MenuSidebarLayoutState())

    useEffect(() => {
        layoutState.current.mode = getMenuSideBarLayout(width)
    }, [width]);

    return (
        <SideBarLayoutContextProvider value={layoutState.current}>
            {children}
        </SideBarLayoutContextProvider>
    )
})