export type TimeControl = {timeMs: number, incrementMs: number}

export interface TimeControlTable {
    getTimeControl({pointsUntil, blitz}: {pointsUntil: number, blitz: boolean}): TimeControl
}