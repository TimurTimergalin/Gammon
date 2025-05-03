import {CSSProperties, ReactNode} from "react";
import {Outlet} from "react-router";

const AuthPage = ({children}: {children: ReactNode}) => {
    const style: CSSProperties = {
        flex: 1,
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 0
    }
    return (
        <div style={style}>
            {children}
        </div>
    )
}

export const AuthPageOutlet = () => <AuthPage><Outlet/></AuthPage>

export default AuthPageOutlet
