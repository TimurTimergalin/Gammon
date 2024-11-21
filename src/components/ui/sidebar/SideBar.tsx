import {CSSProperties, useCallback, useContext, useState} from "react";
import {LayoutModeContext} from "../adapt/LayoutModeContext.ts";
import {expandedSideBarWidth, shrankSideBarWidth} from "./size_constants.ts";
import {Logo} from "./Logo.tsx";
import {TextWithIcon} from "./TextWithIcon.tsx";

export const SideBar = () => {
    const layoutMode = useContext(LayoutModeContext)

    const [menuOpen, setMenuOpen] = useState(false)

    const collapsedStyle: CSSProperties = {
        position: "fixed",
        transition: "transform .1s ease-out",
        transform: menuOpen ? "translate(0)" : "translate(-100%)",
        left: 0,
        zIndex: 1
    }

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

    const menuIconStyle: CSSProperties = {
        width: "50px",
        alignSelf: "start",
        marginLeft: "15px",
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
}