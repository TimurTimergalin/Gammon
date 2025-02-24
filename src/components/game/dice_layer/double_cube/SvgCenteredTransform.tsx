import {ReactNode} from "react";

type RectProps = {
    x: number,
    y: number,
    width: number,
    height: number
}

type TransformProps = {
    position: {
        cx: number,
        cy: number
    }
    scale?: number,
    rotation?: number
}


export const SvgCenteredTransform = ({rect, transformProps, className, children}: {
    rect: RectProps,
    transformProps: TransformProps,
    className?: string,
    children: ReactNode | ReactNode[]
}) => {
    const {position, scale = 1, rotation = 0} = transformProps
    const {cx, cy} = position
    const {x, y, width, height} = rect

    const originTranslateTransform = `translate(-${x} -${y})`
    const scaleTransform = `scale(${scale})`
    const resultTranslateTransform = `translate(${cx - width * scale / 2} ${cy - height * scale / 2})`
    const rotateTransform = `rotate(${rotation} ${cx} ${cy})`
    const transform = [rotateTransform, resultTranslateTransform, scaleTransform, originTranslateTransform].join(" ")

    return <g className={className} transform={transform}>{children}</g>
}