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
        if (receiver === undefined) {
            window.addEventListener("resize", f)
            return () => {
                window.removeEventListener("resize", f)
                if (cleanup !== undefined) {
                    cleanup()
                }
            }
        } else {
            const observer = new ResizeObserver(f)
            observer.observe(receiver.current!)
            return () => {
                observer.disconnect()
                if (cleanup !== undefined) {
                    cleanup()
                }
            }
        }
    }, [f, receiver]);
}