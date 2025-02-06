export interface Logger {
    debug(...data: unknown[]): void

    log(...data: unknown[]): void

    warn(...data: unknown[]): void

    error(...data: unknown[]): void

    assert(condition: boolean, ...data: unknown[]): void
}

export function loggerComposition(...loggers: Logger[]): Logger {
    return {
        debug(...data) {
            for (const logger of loggers) {
                logger.debug(...data)
            }
        },
        log(...data) {
            for (const logger of loggers) {
                logger.log(...data)
            }
        },
        warn(...data): void {
            for (const logger of loggers) {
                logger.warn(...data)
            }
        },
        error(...data): void {
            for (const logger of loggers) {
                logger.error(...data)
            }
        },
        assert(condition, ...data): void {
            for (const logger of loggers) {
                logger.assert(condition, ...data)
            }
        }

    }
}