import {Outlet} from "react-router";
import {MessagesOverlay} from "../components/messages/MessagesOverlay";
import {useState} from "react";
import {MessagesState} from "../controller/messages/MessagesState";
import {MessagesStateContext} from "../controller/messages/context";

export default function MessageLayout() {
    const [messageState] = useState(new MessagesState())
    return (
        <MessagesStateContext.Provider value={messageState}>
            <Outlet />
            <MessagesOverlay />
        </MessagesStateContext.Provider>
    )
}