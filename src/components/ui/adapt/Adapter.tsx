import {ReactNode, useCallback, useRef} from "react";
import {useLayoutMeasure} from "../../../hooks.ts";
import {ScreenSpecs, ScreenSpecsProvider} from "./ScreenSpecs.ts";

export const Adapter = (({children}: {
    children: ReactNode | ReactNode[]
}) => {
    const screenSpecsRef = useRef(new ScreenSpecs())

    const measureWindowWidth = useCallback(
        () => {
            const screenSpecs = screenSpecsRef.current
            screenSpecs.width = document.body.offsetWidth
            screenSpecs.height = document.body.offsetHeight
        }, [screenSpecsRef]
    )
    useLayoutMeasure(measureWindowWidth)

    return (
        <ScreenSpecsProvider value={screenSpecsRef.current}>
            {children}
        </ScreenSpecsProvider>
    )
})