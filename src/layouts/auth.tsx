import {CSSProperties, ReactNode} from "react";
import {Outlet} from "react-router";

const AuthPage = ({children}: {children: ReactNode}) => {
    const style: CSSProperties = {
        flex: 1,
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        minHeight: 0,
        overflow: "auto"
    }
    return (
        <div style={style}>
            {children}
        </div>
    )
}

export const AuthPageOutlet = () => <AuthPage><Outlet/></AuthPage>

export default AuthPageOutlet
