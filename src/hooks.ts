import {EffectCallback, RefObject, useEffect, useLayoutEffect, useState} from "react";

export function useMousePosition(initX: number, initY: number) {
    const [mousePos, setMousePosition] = useState([initX, initY])

    useEffect(() => {
        const callback = (e: MouseEvent) => {
            setMousePosition([e.clientX, e.clientY])
        }
        document.addEventListener("mousemove", callback)
        return () => {
            document.removeEventListener("mousemove", callback)
        }
    }, [])
    return mousePos
}

export function useLayoutMeasure(f: EffectCallback, receiver?: RefObject<Element>) {
    useLayoutEffect(() => {
        const cleanups = [f()]
        const callback = () => cleanups.push(f())

        const observers: ResizeObserver[] = []

        const bodyObserver = new ResizeObserver(callback)
        bodyObserver.observe(document.body)
        observers.push(bodyObserver)

        if (receiver !== undefined && receiver.current !== null) {
            const targetObserver = new ResizeObserver(callback)
            targetObserver.observe(receiver.current)
            observers.push(targetObserver)
        }

        return () => {
            for (const observer of observers) {
                observer.disconnect()
            }
            for (const cleanup of cleanups) {
                if (cleanup !== undefined) {
                    cleanup()
                }
            }
        }
    }, [f, receiver]);
}