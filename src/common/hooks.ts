import {
    EffectCallback,
    MutableRefObject,
    RefObject,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import {PointEvent, pointX, pointY} from "./point_event";
import {FetchType} from "./requests";

export function useMousePosition(initX: number, initY: number) {
    const [mousePos, setMousePosition] = useState([initX, initY])

    useEffect(() => {
        const callback = (e: PointEvent) => {
            setMousePosition([pointX(e), pointY(e)])
        }
        document.addEventListener("mousemove", callback)
        document.addEventListener("touchmove", callback)
        return () => {
            document.removeEventListener("mousemove", callback)
            document.removeEventListener("touchmove", callback)
        }
    }, [])
    return mousePos
}

export function useMousePositionRef() {
    const mousePos = useRef([0, 0])

    useEffect(() => {
        const callback = (e: PointEvent) => {
            mousePos.current = [pointX(e), pointY(e)]
        }
        document.addEventListener("mousemove", callback)
        document.addEventListener("touchmove", callback)
        return () => {
            document.removeEventListener("mousemove", callback)
            document.removeEventListener("touchmove", callback)
        }
    }, []);
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
                if (typeof cleanup === "function") {
                    cleanup()
                }
            }
        }
    }, [f, receiver]);
}

export function useFactoryRef<T>(factory: () => T) {
    const ref = useRef<T | undefined>(undefined)
    if (ref.current === undefined) {
        ref.current = factory()
    }

    return ref as MutableRefObject<T>
}

export function useFetch(): [FetchType, (() => Promise<void>)[]] {
    const abortControllerRef = useRef(new AbortController())
    const cleanupsRef = useRef<(() => Promise<void>)[]>([])

    useEffect(() => {
        const abortController = abortControllerRef.current
        const cleanups = cleanupsRef.current
        return () => {
            Promise.all(cleanups.map(cleanup => cleanup())).then(
                () => abortController.abort("Component de-render")
            )
        }
    }, []);

    return [useCallback<FetchType>(
        (input, init) => {
            if (init?.signal === undefined) {
                init = {signal: abortControllerRef.current.signal, ...(init || {})}
            }
            return fetch(input, init)
        }, []
    ), cleanupsRef.current]
}