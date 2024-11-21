import {createContext} from "react";
import {LayoutMode} from "./LayoutMode.ts";

export const LayoutModeContext = createContext<LayoutMode>("Free")