import {makeAutoObservable} from "mobx";
import {Color} from "../../common/color";


export class TimerState {
    private time: number = 0
    private timer: ReturnType<typeof setInterval> | null = null
    private _owner: Color = Color.WHITE
    get owner(): Color {
        return this._owner;
    }

    set owner(value: Color) {
        this._owner = value;
    }

    private _onEnd: () => void = () => {}
        get onEnd(): () => void {
        return this._onEnd;
    }
    set onEnd(value: () => void) {
        this._onEnd = value;
    }

    constructor() {
        makeAutoObservable(this)
    }

    set(newTimeMs: number) {
        this.time = newTimeMs
    }

    get timeMs(): number {
        return this.time
    }

    increment(dt: number) {
        this.time += dt
    }

    get active(): boolean {
        return this.timer !== null
    }

    start() {
        if (this.timer !== null) {
            return
        }
        if (this.time === 0) {
            return;
        }

        let lastCall = Date.now()
        this.timer = setInterval(() => {
            const newCall = Date.now()
            this.increment(lastCall - newCall)
            lastCall = newCall
            if (this.time <= 0) {
                this.time = 0
                this.onEnd()
                this.stop()
            }
        }, 10)
    }

    stop() {
        if (this.timer === null) {
            return
        }
        clearInterval(this.timer)
        this.timer = null
    }
}