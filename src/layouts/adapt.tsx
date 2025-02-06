import {ReactNode, useCallback, useRef} from "react";
import {useLayoutMeasure} from "../common/hooks";
import {ScreenSpecs, ScreenSpecsProvider} from "../adapt/ScreenSpecs";
import {Outlet} from "react-router";

const Adapter = (({children}: {
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

export const AdapterOutlet = () => (
    <Adapter>
        <Outlet/>
    </Adapter>
)

export default AdapterOutlet
