export type SpaceTaken = {
    width: number,
    height: number
}
export const wh = (width: number, height: number): SpaceTaken => ({width, height})