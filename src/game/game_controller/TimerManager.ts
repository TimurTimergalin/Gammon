import {TimerPairState} from "../timer_state/TimerPairState";
import {Color} from "../../common/color";

export class TimerManager {
    private timerPairState: TimerPairState
    private readonly increment: number

    constructor(timerPairState: TimerPairState, incrementMs: number) {
        this.timerPairState = timerPairState;
        this.increment = incrementMs;
    }

    start(color: Color) {
        if (this.timerPairState.timer1.owner === color) {
            this.timerPairState.timer1.start()
        } else {
            this.timerPairState.timer2.start()
        }
    }

    switch() {
        if (!this.timerPairState.timer1.active && !this.timerPairState.timer2.active) {
            return
        }
        if (this.timerPairState.timer1.active) {
            this.timerPairState.timer1.stop()
            this.timerPairState.timer1.increment(this.increment)
            this.timerPairState.timer2.start()
        } else {
            this.timerPairState.timer2.stop()
            this.timerPairState.timer2.increment(this.increment)
            this.timerPairState.timer1.start()
        }
    }

    stop() {
        this.timerPairState.timer1.stop()
        this.timerPairState.timer2.stop()
    }

    update(newTime: number, color: Color) {
        const timer = this.timerPairState.timer1.owner === color ?
            this.timerPairState.timer1 : this.timerPairState.timer2

        timer.set(newTime)
    }

    swap() {
        this.timerPairState.swap()
    }
}