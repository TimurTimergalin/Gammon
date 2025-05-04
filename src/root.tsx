import {ReactNode} from "react";
import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "react-router";
import "croppie/croppie.css"

export function Layout(
    {children}: { children: ReactNode }
) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link href={"/index.css"} rel={"stylesheet"}/>
                <title>Backgammon</title>
                <Meta/>
                <Links/>
            </head>
            <body>
            <div id={"root"}>
                {children}
            </div>
            <ScrollRestoration/>
            <Scripts/>
            </body>
        </html>
    )
}

export default function Root() {
    return <Outlet />
}