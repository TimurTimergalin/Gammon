import {CSSProperties, useCallback, useState} from "react";
import {Logo} from "./Logo.tsx";
import {TextWithIcon} from "./TextWithIcon.tsx";
import {useScreenSpecs} from "../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";

export const SideBar = observer(function SideBar() {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode

    const [menuOpen, setMenuOpen] = useState(false)

    const collapsedStyle: CSSProperties = {
        position: "fixed",
        transition: "transform .1s ease-out",
        transform: menuOpen ? "translate(0)" : "translate(-100%)",
        left: 0,
        zIndex: 1
    }

    const expandedSideBarWidth = 200 * screenSpecs.height / 900
    const shrankSideBarWidth = 60 * screenSpecs.height / 900

    const barStyle: CSSProperties = {
        width: layoutMode === "Free" || layoutMode === "Collapsed" ? expandedSideBarWidth : shrankSideBarWidth,
        height: "100%",
        backgroundColor: "#200a06",
        ...(layoutMode === "Collapsed" ? collapsedStyle : {})
    }

    const screenStyle: CSSProperties = {
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#66666666",
        display: menuOpen ? "block" : "none"
    }

    const iconWidth = 40 * screenSpecs.height / 900
    const iconMarginLeft = 30 * screenSpecs.height / 900

    const menuIconStyle: CSSProperties = {
        width: `${iconWidth}px`,
        alignSelf: "start",
        marginLeft: `${iconMarginLeft}px`,
        marginTop: "10px",
        marginBottom: "15px"
    }

    const toggleMenuCallback = useCallback(
        () => {
            setMenuOpen(!menuOpen)
        }, [menuOpen]
    )

    return (
        <>
            <div style={barStyle}>
                <Logo/>
                <TextWithIcon text={"Играть"} imageSrc={"placeholder.svg"} imageAlt={"Play icon"}/>
            </div>
            {layoutMode === "Collapsed" &&
                <>
                    <img src={"menu_icon.svg"} style={menuIconStyle} alt={"Menu"} onClick={toggleMenuCallback}/>
                    <div style={screenStyle} onClick={toggleMenuCallback}/>
                </>
            }
        </>
    )
})