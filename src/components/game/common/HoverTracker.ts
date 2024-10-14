import {createContext} from "react";

export class HoverTracker {
    hoveredIndex: number | null = null;
}

export const HoverTrackerContext = createContext<HoverTracker | null>(null)