import {Logger} from "../Logger.ts";
import {LoggerProvider} from "../LoggerProvider.ts";

class ConsoleLogger implements Logger {
    private scope: string

    constructor(scope: string) {
        this.scope = scope;
    }

    assert(condition: boolean, ...data: unknown[]): void {
        console.assert(condition, `-- ${this.scope} --`, ...data)
    }

    debug(...data: unknown[]): void {
        console.debug(`-- ${this.scope} --`, ...data)
    }

    error(...data: unknown[]): void {
        console.error(`-- ${this.scope} --`, ...data)
    }

    log(...data: unknown[]): void {
        console.log(`-- ${this.scope} --`, ...data)
    }

    warn(...data: unknown[]): void {
        console.warn(`-- ${this.scope} --`, ...data)
    }
}

export class ConsoleLoggerProvider implements LoggerProvider {
    getLogger(scope: string): Logger {
        return new ConsoleLogger(scope);
    }
}