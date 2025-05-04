import {createContext} from "react";
import {ControlPanelState} from "./ControlPanelState";

export const ControlPanelContext = createContext(new ControlPanelState())
