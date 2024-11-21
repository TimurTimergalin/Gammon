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
        const cleanup = f()

        const observer = new ResizeObserver(f)
        observer.observe(receiver?.current || document.body)
        return () => {
            observer.disconnect()
            if (cleanup !== undefined) {
                cleanup()
            }
        }
    }, [f, receiver]);
}