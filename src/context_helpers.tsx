import {Context, ReactNode, useRef} from "react";

function GlobalContext<T, R extends T>({context, initialValue, children}: {
    context: Context<T>,
    initialValue: R,
    children?: ReactNode | undefined
}) {
    const ref = useRef(initialValue)
    return (
        <context.Provider value={ref.current}>
            {children}
        </context.Provider>
    )
}

export type ContextWithInit<T> = {
    [K in keyof T]: [Context<T[K]>, T[K]]
}

export default function WithGlobals<T>({contexts, children}: {
    children?: ReactNode | undefined,
    contexts: ContextWithInit<T>
}) {
    let res = children
    for (const i in contexts) {
        const [context, val] = contexts[i]
        res = (
            <GlobalContext context={context} initialValue={val}>
                {res}
            </GlobalContext>
        )
    }
    return (
        <>
            {res}
        </>
    )
}
