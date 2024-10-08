import {EffectCallback, useEffect, useLayoutEffect, useState} from "react";

export function useMousePosition(initX: number, initY: number) {
    const [mousePos, setMousePosition] = useState([initX, initY])

    useEffect(() => {
        document.addEventListener("mousemove", (e) => {
            setMousePosition([e.clientX, e.clientY])
        })
    }, [])
    return mousePos
}

export function useLayoutMeasure(f: EffectCallback) {
    useLayoutEffect(() => {
        window.addEventListener("resize", f)
        return f()
    }, [f]);
}