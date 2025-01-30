import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {logger} from "../../logging/main.ts";

const console = logger("components/adapt")

export type LayoutMode = "Free" | "Tight" | "Shrinking" | "Collapsed"
export type ScaleMode = "Normal" | "Minimized" | "Micro"

export class ScreenSpecs {
    constructor() {
        makeAutoObservable(this)
    }

    private _width: number = 0

    get width() {
        return this._width
    }

    set width(val) {
        this._width = val
    }

    private _height: number = 0

    get height() {
        return this._height
    }

    // Все вычисления разметки были произведены для экрана высоты 900, поэтому

    set height(val) {
        this._height = val
    }

    // все размеры, указанные в пикселях, должны быть нормированы по высоте экрана
    get scaleFactor() {
        const baseHeight = 900
        return this._height / baseHeight
    }

    get layoutMode(): LayoutMode {
        const ratio = this._width / this._height
        const baseHeight = 900
        return ratio >= 1560 / baseHeight ? "Free" :
            ratio >= 1220 / baseHeight ? "Tight" :
                ratio >= 1000 / baseHeight ? "Shrinking" : "Collapsed"
    }

    get scaleMode(): ScaleMode {
        return this._height >= 590 ? "Normal" : this._height >= 400 ? "Minimized" : "Micro"
    }
}

const ScreenSpecsContext = createContext<ScreenSpecs | null>(null)

export const ScreenSpecsProvider = ScreenSpecsContext.Provider

export const useScreenSpecs = () => {
    const screenSpecs = useContext(ScreenSpecsContext)
    console.assert(screenSpecs !== null)
    return screenSpecs!
}
