import {createContext} from "react";
import {MessagesState} from "./MessagesState";

export const MessagesStateContext = createContext(new MessagesState())