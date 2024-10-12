import {EffectCallback, useEffect, useLayoutEffect, useState} from "react";

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

export function useLayoutMeasure(f: EffectCallback) {
    useLayoutEffect(() => {
        window.addEventListener("resize", f)
        const cleanup = f()
        return () => {
            window.removeEventListener("resize", f)
            if (cleanup !== undefined) {
                cleanup()
            }
        }
    }, [f]);
}