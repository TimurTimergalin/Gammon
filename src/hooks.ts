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

        const observer = new ResizeObserver(callback)
        observer.observe(receiver?.current || document.body)

        return () => {
            observer.disconnect()
            for (const cleanup of cleanups) {
                if (cleanup !== undefined) {
                    cleanup()
                }
            }
        }
    }, [f, receiver]);
}